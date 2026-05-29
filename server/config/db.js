const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "baza997",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || "travelplanner",
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log("Inicjalizacja schematu bazy danych...");

    // 1. Tabela trips
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        owner VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        budget NUMERIC(12, 2) DEFAULT 0,
        description TEXT,
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela itinerary
    await client.query(`
      CREATE TABLE IF NOT EXISTS itinerary (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        day_number INTEGER DEFAULT 1,
        time TIME,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cost NUMERIC(12, 2) DEFAULT 0,
        location VARCHAR(255)
      );
    `);

    // 3. Tabela expenses
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        description VARCHAR(255),
        payer VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Tabela suggestions
    await client.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        votes INTEGER DEFAULT 0,
        link VARCHAR(512),
        suggested_by VARCHAR(255)
      );
    `);

    // 5. Tabela checklist
    await client.query(`
      CREATE TABLE IF NOT EXISTS checklist (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        task VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        assignee VARCHAR(255)
      );
    `);

    console.log("Inicjalizacja tabel zakończona sukcesem.");
  } catch (err) {
    console.error("Błąd podczas inicjalizacji bazy danych:", err);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initDb,
};
