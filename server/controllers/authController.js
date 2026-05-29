const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "travelplanner_secret_key_997";

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane" });
  }

  try {
    // Sprawdzenie czy użytkownik istnieje
    const userCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Użytkownik o takiej nazwie już istnieje" });
    }

    // Haszowanie hasła
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Zapis do bazy
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hash]
    );
    const user = result.rows[0];

    // Generowanie tokena JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas rejestracji" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane" });
  }

  try {
    // Wyszukanie użytkownika
    const result = await pool.query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    const user = result.rows[0];

    // Weryfikacja hasła
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    // Generowanie tokena JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas logowania" });
  }
};
