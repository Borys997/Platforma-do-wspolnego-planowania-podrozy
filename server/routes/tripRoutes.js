const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// GET wszystkie podróże
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, owner, name, destination, 
                   TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate", 
                   TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate", 
                   budget::float, description, votes 
            FROM trips 
            ORDER BY votes DESC, id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania podróży" });
    }
});

// POST dodaj podróż
router.post("/", async (req, res) => {
    const {
        owner,
        name,
        destination,
        startDate,
        endDate,
        budget,
        description
    } = req.body;

    if (!name || !destination) {
        return res.status(400).json({
            message: "Brakuje danych"
        });
    }

    try {
        const parsedBudget = budget ? parseFloat(budget) : 0;
        const parsedStartDate = startDate || null;
        const parsedEndDate = endDate || null;

        const result = await pool.query(
            `INSERT INTO trips (owner, name, destination, start_date, end_date, budget, description, votes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
             RETURNING id, owner, name, destination, 
                       TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate", 
                       TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate", 
                       budget::float, description, votes`,
            [owner || "Anonim", name, destination, parsedStartDate, parsedEndDate, parsedBudget, description || ""]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas dodawania podróży" });
    }
});

// GET jedna podróż
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, owner, name, destination, 
                    TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate", 
                    TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate", 
                    budget::float, description, votes 
             FROM trips 
             WHERE id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Nie znaleziono podróży" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania podróży" });
    }
});

// DELETE podróż
router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM trips WHERE id = $1", [req.params.id]);
        res.json({ message: "Usunięto podróż" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas usuwania podróży" });
    }
});

// PATCH głosowanie
router.patch("/:id/vote", async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE trips 
             SET votes = votes + 1 
             WHERE id = $1 
             RETURNING id, owner, name, destination, 
                       TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate", 
                       TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate", 
                       budget::float, description, votes`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Nie znaleziono podróży" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas głosowania" });
    }
});

module.exports = router;
