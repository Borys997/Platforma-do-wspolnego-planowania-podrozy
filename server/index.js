const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDb } = require("./config/db");
const tripRoutes = require("./routes/tripRoutes");
const detailRoutes = require("./routes/detailRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("TravelPlanner API działa");
});

// Podłączenie tras
app.use("/api/trips", tripRoutes);
app.use("/api/trips", detailRoutes);

const PORT = process.env.PORT || 5000;

// Inicjalizacja bazy danych i start serwera
const startServer = async () => {
    await initDb();
    app.listen(PORT, () => {
        console.log(`Serwer działa na porcie ${PORT}`);
    });
};

startServer();
