const { pool } = require("../config/db");

// ==========================================
// 1. PLAN PODRÓŻY (ITINERARY)
// ==========================================
exports.getItinerary = async (req, res) => {
  const { tripId } = req.params;
  try {
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

  if (!title) {
    return res.status(400).json({ message: "Tytuł jest wymagany" });
  }

  try {
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
  try {
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
  try {
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

  if (!category || !amount) {
    return res.status(400).json({ message: "Kategoria i kwota są wymagane" });
  }

  try {
    const parsedAmount = parseFloat(amount);
    const result = await pool.query(
      `INSERT INTO expenses (trip_id, category, amount, description, payer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, trip_id as "tripId", category, amount::float, description, payer`,
      [tripId, category, parsedAmount, description || "", payer || "Anonim"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas dodawania wydatku" });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
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
  try {
    const result = await pool.query(
      `SELECT id, trip_id as "tripId", category, name, description, votes, link, suggested_by as "suggestedBy" 
       FROM suggestions 
       WHERE trip_id = $1 
       ORDER BY votes DESC, id DESC`,
      [tripId]
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

  if (!category || !name) {
    return res.status(400).json({ message: "Kategoria i nazwa są wymagane" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO suggestions (trip_id, category, name, description, votes, link, suggested_by)
       VALUES ($1, $2, $3, $4, 0, $5, $6)
       RETURNING id, trip_id as "tripId", category, name, description, votes, link, suggested_by as "suggestedBy"`,
      [tripId, category, name, description || "", link || "", suggestedBy || "Anonim"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas dodawania propozycji" });
  }
};

exports.deleteSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM suggestions WHERE id = $1", [id]);
    res.json({ message: "Usunięto propozycję" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas usuwania propozycji" });
  }
};

exports.voteSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE suggestions 
       SET votes = votes + 1 
       WHERE id = $1 
       RETURNING id, trip_id as "tripId", category, name, description, votes, link, suggested_by as "suggestedBy"`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nie znaleziono propozycji" });
    }

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
  try {
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

  if (!task) {
    return res.status(400).json({ message: "Zadanie jest wymagane" });
  }

  try {
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
  try {
    await pool.query("DELETE FROM checklist WHERE id = $1", [id]);
    res.json({ message: "Usunięto zadanie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas usuwania zadania" });
  }
};

exports.toggleChecklistItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE checklist 
       SET is_completed = NOT is_completed 
       WHERE id = $1 
       RETURNING id, trip_id as "tripId", task, is_completed as "isCompleted", assignee`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nie znaleziono zadania" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd podczas przełączania stanu zadania" });
  }
};
