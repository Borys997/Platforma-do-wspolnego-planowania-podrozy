const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Pomocnicza funkcja sprawdzająca czy użytkownik należy do pokoju
const checkRoomMembership = async (roomId, userId) => {
  const result = await pool.query(
    "SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2",
    [roomId, userId]
  );
  return result.rows.length > 0;
};

// GET wszystkie podróże w danym pokoju (?roomId=X)
router.get("/", async (req, res) => {
    const { roomId } = req.query;
    const userId = req.user.id;

    if (!roomId) {
        return res.status(400).json({ message: "Brak parametru roomId" });
    }

    try {
        const isMember = await checkRoomMembership(roomId, userId);
        if (!isMember) {
            return res.status(403).json({ message: "Brak dostępu do tego pokoju" });
        }

        const result = await pool.query(`
            SELECT t.id, t.owner, t.name, t.destination, 
                   TO_CHAR(t.start_date, 'YYYY-MM-DD') as "startDate", 
                   TO_CHAR(t.end_date, 'YYYY-MM-DD') as "endDate", 
                   t.budget::float, t.description,
                   COALESCE(v.vote_count, 0)::int as votes,
                   EXISTS(SELECT 1 FROM trip_votes WHERE trip_id = t.id AND user_id = $2) as "hasVoted"
            FROM trips t
            LEFT JOIN (
                SELECT trip_id, COUNT(*) as vote_count 
                FROM trip_votes 
                GROUP BY trip_id
            ) v ON t.id = v.trip_id
            WHERE t.room_id = $1
            ORDER BY votes DESC, t.id DESC
        `, [roomId, userId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania podróży" });
    }
});

// POST dodaj podróż do pokoju
router.post("/", async (req, res) => {
    const {
        roomId,
        owner,
        name,
        destination,
        startDate,
        endDate,
        budget,
        description
    } = req.body;
    const userId = req.user.id;

    if (!roomId || !name || !destination) {
        return res.status(400).json({ message: "Brak wymaganych danych (roomId, name, destination)" });
    }

    try {
        const isMember = await checkRoomMembership(roomId, userId);
        if (!isMember) {
            return res.status(403).json({ message: "Brak dostępu do tego pokoju" });
        }

        const parsedBudget = budget ? parseFloat(budget) : 0;
        const parsedStartDate = startDate || null;
        const parsedEndDate = endDate || null;

        const result = await pool.query(
            `INSERT INTO trips (room_id, creator_id, owner, name, destination, start_date, end_date, budget, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, room_id as "roomId", owner, name, destination, 
                       TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate", 
                       TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate", 
                       budget::float, description, 0 as votes, false as "hasVoted"`,
            [roomId, userId, owner || req.user.username, name, destination, parsedStartDate, parsedEndDate, parsedBudget, description || ""]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas dodawania podróży" });
    }
});

// GET jedna podróż
router.get("/:id", async (req, res) => {
    const userId = req.user.id;
    try {
        // Sprawdzenie pokoju podróży
        const tripCheck = await pool.query("SELECT room_id FROM trips WHERE id = $1", [req.params.id]);
        if (tripCheck.rows.length === 0) {
            return res.status(404).json({ message: "Nie znaleziono podróży" });
        }

        const isMember = await checkRoomMembership(tripCheck.rows[0].room_id, userId);
        if (!isMember) {
            return res.status(403).json({ message: "Brak dostępu do tej podróży" });
        }

        const result = await pool.query(
            `SELECT t.id, t.owner, t.name, t.destination, 
                    TO_CHAR(t.start_date, 'YYYY-MM-DD') as "startDate", 
                    TO_CHAR(t.end_date, 'YYYY-MM-DD') as "endDate", 
                    t.budget::float, t.description,
                    COALESCE(v.vote_count, 0)::int as votes,
                    EXISTS(SELECT 1 FROM trip_votes WHERE trip_id = t.id AND user_id = $2) as "hasVoted"
             FROM trips t 
             LEFT JOIN (
                 SELECT trip_id, COUNT(*) as vote_count 
                 FROM trip_votes 
                 GROUP BY trip_id
             ) v ON t.id = v.trip_id
             WHERE t.id = $1`,
            [req.params.id, userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania podróży" });
    }
});

// DELETE podróż
router.delete("/:id", async (req, res) => {
    const userId = req.user.id;
    try {
        const tripCheck = await pool.query("SELECT room_id FROM trips WHERE id = $1", [req.params.id]);
        if (tripCheck.rows.length === 0) {
            return res.status(404).json({ message: "Nie znaleziono podróży" });
        }

        const isMember = await checkRoomMembership(tripCheck.rows[0].room_id, userId);
        if (!isMember) {
            return res.status(403).json({ message: "Brak dostępu do tej podróży" });
        }

        await pool.query("DELETE FROM trips WHERE id = $1", [req.params.id]);
        res.json({ message: "Usunięto podróż" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas usuwania podróży" });
    }
});

// PATCH głosowanie (przełącznik: ponowne kliknięcie cofa głos)
router.patch("/:id/vote", async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;

    try {
        // Sprawdzenie pokoju podróży
        const tripCheck = await pool.query("SELECT room_id FROM trips WHERE id = $1", [tripId]);
        if (tripCheck.rows.length === 0) {
            return res.status(404).json({ message: "Nie znaleziono podróży" });
        }

        const isMember = await checkRoomMembership(tripCheck.rows[0].room_id, userId);
        if (!isMember) {
            return res.status(403).json({ message: "Brak dostępu" });
        }

        // Sprawdzenie czy użytkownik już głosował
        const voteCheck = await pool.query(
            "SELECT 1 FROM trip_votes WHERE trip_id = $1 AND user_id = $2",
            [tripId, userId]
        );

        if (voteCheck.rows.length > 0) {
            // Cofnięcie głosu
            await pool.query(
                "DELETE FROM trip_votes WHERE trip_id = $1 AND user_id = $2",
                [tripId, userId]
            );
        } else {
            // Dodanie głosu
            await pool.query(
                "INSERT INTO trip_votes (trip_id, user_id) VALUES ($1, $2)",
                [tripId, userId]
            );
        }

        // Pobranie zaktualizowanego stanu podróży
        const result = await pool.query(
            `SELECT t.id, t.owner, t.name, t.destination, 
                    TO_CHAR(t.start_date, 'YYYY-MM-DD') as "startDate", 
                    TO_CHAR(t.end_date, 'YYYY-MM-DD') as "endDate", 
                    t.budget::float, t.description,
                    COALESCE(v.vote_count, 0)::int as votes,
                    EXISTS(SELECT 1 FROM trip_votes WHERE trip_id = t.id AND user_id = $2) as "hasVoted"
             FROM trips t
             LEFT JOIN (
                 SELECT trip_id, COUNT(*) as vote_count 
                 FROM trip_votes 
                 GROUP BY trip_id
             ) v ON t.id = v.trip_id
             WHERE t.id = $1`,
            [tripId, userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas głosowania" });
    }
});

module.exports = router;
