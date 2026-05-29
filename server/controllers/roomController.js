const { pool } = require("../config/db");

// Generator unikalnego kodu pokoju (6 znaków, A-Z, 0-9)
const generateRoomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

exports.createRoom = async (req, res) => {
  const { name } = req.body;
  const ownerId = req.user.id;

  if (!name) {
    return res.status(400).json({ message: "Nazwa pokoju jest wymagana" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Szukanie unikalnego kodu
    let code = generateRoomCode();
    let isUnique = false;
    while (!isUnique) {
      const codeCheck = await client.query("SELECT id FROM rooms WHERE code = $1", [code]);
      if (codeCheck.rows.length === 0) {
        isUnique = true;
      } else {
        code = generateRoomCode();
      }
    }

    // Dodanie pokoju
    const roomResult = await client.query(
      "INSERT INTO rooms (name, code, owner_id) VALUES ($1, $2, $3) RETURNING id, name, code, owner_id as \"ownerId\"",
      [name, code, ownerId]
    );
    const room = roomResult.rows[0];

    // Automatyczne dodanie właściciela jako członka pokoju
    await client.query(
      "INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)",
      [room.id, ownerId]
    );

    await client.query("COMMIT");
    res.status(201).json(room);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas tworzenia pokoju" });
  } finally {
    client.release();
  }
};

exports.joinRoom = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;

  if (!code) {
    return res.status(400).json({ message: "Kod pokoju jest wymagany" });
  }

  const cleanCode = code.trim().toUpperCase();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Wyszukanie pokoju
    const roomResult = await client.query(
      "SELECT id, name, code, owner_id as \"ownerId\" FROM rooms WHERE code = $1",
      [cleanCode]
    );
    if (roomResult.rows.length === 0) {
      await client.query("COMMIT");
      return res.status(404).json({ message: "Pokój o podanym kodzie nie istnieje" });
    }

    const room = roomResult.rows[0];

    // Sprawdzenie, czy użytkownik jest już członkiem
    const memberCheck = await client.query(
      "SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2",
      [room.id, userId]
    );

    if (memberCheck.rows.length === 0) {
      // Dodanie do członków
      await client.query(
        "INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)",
        [room.id, userId]
      );
    }

    await client.query("COMMIT");
    res.json(room);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas dołączania do pokoju" });
  } finally {
    client.release();
  }
};

exports.getRooms = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT r.id, r.name, r.code, r.owner_id as "ownerId", u.username as "ownerName" 
       FROM rooms r 
       JOIN room_members rm ON r.id = rm.room_id 
       JOIN users u ON r.owner_id = u.id 
       WHERE rm.user_id = $1
       ORDER BY r.id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas pobierania pokoi" });
  }
};
