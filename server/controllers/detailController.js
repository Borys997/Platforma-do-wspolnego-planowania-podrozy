const { pool } = require("../config/db");

// Pomocniczy walidator dostępu użytkownika do podróży przez pokój
const checkTripAccess = async (tripId, userId) => {
  const result = await pool.query(
    `SELECT t.room_id 
     FROM trips t 
     JOIN room_members rm ON t.room_id = rm.room_id 
     WHERE t.id = $1 AND rm.user_id = $2`,
    [tripId, userId]
  );
  return result.rows.length > 0;
};

// Pomocniczy walidator dla bezpośrednich elementów (itinerary, expense, suggestion, checklist)
const checkItemAccess = async (tableName, itemId, userId) => {
  const result = await pool.query(
    `SELECT t.room_id 
     FROM ${tableName} item
     JOIN trips t ON item.trip_id = t.id
     JOIN room_members rm ON t.room_id = rm.room_id
     WHERE item.id = $1 AND rm.user_id = $2`,
    [itemId, userId]
  );
  return result.rows.length > 0;
};

// ==========================================
// 1. PLAN PODRÓŻY (ITINERARY)
// ==========================================
exports.getItinerary = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu do tej podróży" });
    }

    const result = await pool.query(
      `SELECT id, trip_id as "tripId", day_number as "dayNumber", 
              TO_CHAR(time, 'HH24:MI') as "time", title, description, 
              cost::float, location 
       FROM itinerary 
       WHERE trip_id = $1 
       ORDER BY day_number ASC, time ASC, id ASC`,
      [tripId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas pobierania planu podróży" });
  }
};

exports.addItinerary = async (req, res) => {
  const { tripId } = req.params;
  const { dayNumber, time, title, description, cost, location } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ message: "Tytuł jest wymagany" });
  }

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const parsedDay = dayNumber ? parseInt(dayNumber) : 1;
    const parsedCost = cost ? parseFloat(cost) : 0;
    const timeValue = time || null;

    const result = await pool.query(
      `INSERT INTO itinerary (trip_id, day_number, time, title, description, cost, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, trip_id as "tripId", day_number as "dayNumber", 
                 TO_CHAR(time, 'HH24:MI') as "time", title, description, 
                 cost::float, location`,
      [tripId, parsedDay, timeValue, title, description || "", parsedCost, location || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas dodawania punktu planu" });
  }
};

exports.deleteItinerary = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkItemAccess("itinerary", id, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak uprawnień do usunięcia tego elementu" });
    }

    await pool.query("DELETE FROM itinerary WHERE id = $1", [id]);
    res.json({ message: "Usunięto punkt planu" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas usuwania punktu planu" });
  }
};

// ==========================================
// 2. WYDATKI (EXPENSES)
// ==========================================
exports.getExpenses = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const result = await pool.query(
      `SELECT id, trip_id as "tripId", category, amount::float, description, payer 
       FROM expenses 
       WHERE trip_id = $1 
       ORDER BY created_at DESC, id DESC`,
      [tripId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas pobierania wydatków" });
  }
};

exports.addExpense = async (req, res) => {
  const { tripId } = req.params;
  const { category, amount, description, payer } = req.body;
  const userId = req.user.id;

  if (!category || !amount) {
    return res.status(400).json({ message: "Kategoria i kwota są wymagane" });
  }

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const parsedAmount = parseFloat(amount);
    const result = await pool.query(
      `INSERT INTO expenses (trip_id, category, amount, description, payer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, trip_id as "tripId", category, amount::float, description, payer`,
      [tripId, category, parsedAmount, description || "", payer || req.user.username]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas dodawania wydatku" });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkItemAccess("expenses", id, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak uprawnień" });
    }

    await pool.query("DELETE FROM expenses WHERE id = $1", [id]);
    res.json({ message: "Usunięto wydatek" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas usuwania wydatku" });
  }
};

// ==========================================
// 3. PROPOZYCJE (SUGGESTIONS)
// ==========================================
exports.getSuggestions = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const result = await pool.query(
      `SELECT s.id, s.trip_id as "tripId", s.category, s.name, s.description, s.link, s.suggested_by as "suggestedBy",
              COALESCE(v.vote_count, 0)::int as votes,
              EXISTS(SELECT 1 FROM suggestion_votes WHERE suggestion_id = s.id AND user_id = $2) as "hasVoted"
       FROM suggestions s
       LEFT JOIN (
           SELECT suggestion_id, COUNT(*) as vote_count 
           FROM suggestion_votes 
           GROUP BY suggestion_id
       ) v ON s.id = v.suggestion_id
       WHERE s.trip_id = $1
       ORDER BY votes DESC, s.id DESC`,
      [tripId, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas pobierania propozycji" });
  }
};

exports.addSuggestion = async (req, res) => {
  const { tripId } = req.params;
  const { category, name, description, link, suggestedBy } = req.body;
  const userId = req.user.id;

  if (!category || !name) {
    return res.status(400).json({ message: "Kategoria i nazwa są wymagane" });
  }

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const result = await pool.query(
      `INSERT INTO suggestions (trip_id, category, name, description, link, suggested_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, trip_id as "tripId", category, name, description, 0 as votes, link, suggested_by as "suggestedBy", false as "hasVoted"`,
      [tripId, category, name, description || "", link || "", suggestedBy || req.user.username]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas dodawania propozycji" });
  }
};

exports.deleteSuggestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkItemAccess("suggestions", id, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak uprawnień" });
    }

    await pool.query("DELETE FROM suggestions WHERE id = $1", [id]);
    res.json({ message: "Usunięto propozycję" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas usuwania propozycji" });
  }
};

exports.voteSuggestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkItemAccess("suggestions", id, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    // Sprawdzenie czy już głosowano
    const voteCheck = await pool.query(
      "SELECT 1 FROM suggestion_votes WHERE suggestion_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (voteCheck.rows.length > 0) {
      // Cofnięcie głosu
      await pool.query(
        "DELETE FROM suggestion_votes WHERE suggestion_id = $1 AND user_id = $2",
        [id, userId]
      );
    } else {
      // Dodanie głosu
      await pool.query(
        "INSERT INTO suggestion_votes (suggestion_id, user_id) VALUES ($1, $2)",
        [id, userId]
      );
    }

    // Zwrócenie zaktualizowanej propozycji
    const result = await pool.query(
      `SELECT s.id, s.trip_id as "tripId", s.category, s.name, s.description, s.link, s.suggested_by as "suggestedBy",
              COALESCE(v.vote_count, 0)::int as votes,
              EXISTS(SELECT 1 FROM suggestion_votes WHERE suggestion_id = s.id AND user_id = $2) as "hasVoted"
       FROM suggestions s
       LEFT JOIN (
           SELECT suggestion_id, COUNT(*) as vote_count 
           FROM suggestion_votes 
           GROUP BY suggestion_id
       ) v ON s.id = v.suggestion_id
       WHERE s.id = $1`,
      [id, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas głosowania na propozycję" });
  }
};

// ==========================================
// 4. LISTA ZADAŃ (CHECKLIST)
// ==========================================
exports.getChecklist = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const result = await pool.query(
      `SELECT id, trip_id as "tripId", task, is_completed as "isCompleted", assignee 
       FROM checklist 
       WHERE trip_id = $1 
       ORDER BY id ASC`,
      [tripId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas pobierania zadań" });
  }
};

exports.addChecklistItem = async (req, res) => {
  const { tripId } = req.params;
  const { task, assignee } = req.body;
  const userId = req.user.id;

  if (!task) {
    return res.status(400).json({ message: "Zadanie jest wymagane" });
  }

  try {
    const hasAccess = await checkTripAccess(tripId, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const result = await pool.query(
      `INSERT INTO checklist (trip_id, task, is_completed, assignee)
       VALUES ($1, $2, FALSE, $3)
       RETURNING id, trip_id as "tripId", task, is_completed as "isCompleted", assignee`,
      [tripId, task, assignee || "Wszyscy"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas dodawania zadania" });
  }
};

exports.deleteChecklistItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkItemAccess("checklist", id, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak uprawnień" });
    }

    await pool.query("DELETE FROM checklist WHERE id = $1", [id]);
    res.json({ message: "Usunięto zadanie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas usuwania zadania" });
  }
};

exports.toggleChecklistItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const hasAccess = await checkItemAccess("checklist", id, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Brak dostępu" });
    }

    const result = await pool.query(
      `UPDATE checklist 
       SET is_completed = NOT is_completed 
       WHERE id = $1 
       RETURNING id, trip_id as "tripId", task, is_completed as "isCompleted", assignee`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas przełączania stanu zadania" });
  }
};
