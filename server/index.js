const express = require("express");
const cors = require("cors");
require("dotenv").config();

const tripRoutes = require("./routes/tripRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("TravelPlanner API działa");
});
app.use("/api/trips", tripRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
    
});

