const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", roomController.getRooms);
router.post("/", roomController.createRoom);
router.post("/join", roomController.joinRoom);

module.exports = router;
