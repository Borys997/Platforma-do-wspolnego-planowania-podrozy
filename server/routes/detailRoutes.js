const express = require("express");
const router = express.Router({ mergeParams: true });
const detailController = require("../controllers/detailController");

// Plan podróży (Itinerary)
router.get("/:tripId/itinerary", detailController.getItinerary);
router.post("/:tripId/itinerary", detailController.addItinerary);
router.delete("/:tripId/itinerary/:id", detailController.deleteItinerary);

// Wydatki (Expenses)
router.get("/:tripId/expenses", detailController.getExpenses);
router.post("/:tripId/expenses", detailController.addExpense);
router.delete("/:tripId/expenses/:id", detailController.deleteExpense);

// Propozycje (Suggestions)
router.get("/:tripId/suggestions", detailController.getSuggestions);
router.post("/:tripId/suggestions", detailController.addSuggestion);
router.delete("/:tripId/suggestions/:id", detailController.deleteSuggestion);
router.patch("/:tripId/suggestions/:id/vote", detailController.voteSuggestion);

// Lista zadań (Checklist)
router.get("/:tripId/checklist", detailController.getChecklist);
router.post("/:tripId/checklist", detailController.addChecklistItem);
router.delete("/:tripId/checklist/:id", detailController.deleteChecklistItem);
router.patch("/:tripId/checklist/:id/toggle", detailController.toggleChecklistItem);

module.exports = router;
