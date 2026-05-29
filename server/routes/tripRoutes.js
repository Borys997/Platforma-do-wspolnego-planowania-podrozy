const express = require("express");
const router = express.Router();

// “baza” w pamięci
let trips = [];
let currentId = 1;

// GET wszystkie podróże
router.get("/", (req, res) => {
    res.json(trips);
});

// POST dodaj podróż
router.post("/", (req, res) => {
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

    const newTrip = {
        id: currentId++,
        owner,
        name,
        destination,
        startDate,
        endDate,
        budget,
        description,
        votes: 0
    };

    trips.push(newTrip);

    res.status(201).json(newTrip);
});

// GET jedna podróż
router.get("/:id", (req, res) => {
    const trip = trips.find(t => t.id == req.params.id);

    if (!trip) {
        return res.status(404).json({ message: "Nie znaleziono podróży" });
    }

    res.json(trip);
});

// DELETE podróż
router.delete("/:id", (req, res) => {
    trips = trips.filter(t => t.id != req.params.id);
    res.json({ message: "Usunięto podróż" });
});
router.patch("/:id/vote", (req, res) => {

    const trip = trips.find(t => t.id == req.params.id);

    if (!trip) {
        return res.status(404).json({
            message: "Nie znaleziono podróży"
        });
    }

    trip.votes += 1;

    res.json(trip);
});

module.exports = router;

