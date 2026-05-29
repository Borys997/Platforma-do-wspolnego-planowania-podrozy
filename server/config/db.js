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
    console.log("Sprawdzanie struktury bazy danych...");

    // Sprawdzenie, czy nowa tabela 'users' już istnieje
    const checkUsersTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const usersExists = checkUsersTable.rows[0].exists;

    if (!usersExists) {
      console.log("Wykryto stary schemat bazy. Czyszczenie dotychczasowych tabel...");
      await client.query("DROP TABLE IF EXISTS checklist CASCADE;");
      await client.query("DROP TABLE IF EXISTS suggestions CASCADE;");
      await client.query("DROP TABLE IF EXISTS expenses CASCADE;");
      await client.query("DROP TABLE IF EXISTS itinerary CASCADE;");
      await client.query("DROP TABLE IF EXISTS trips CASCADE;");
      await client.query("DROP TABLE IF EXISTS room_members CASCADE;");
      await client.query("DROP TABLE IF EXISTS rooms CASCADE;");
      await client.query("DROP TABLE IF EXISTS users CASCADE;");
      await client.query("DROP TABLE IF EXISTS trip_votes CASCADE;");
      await client.query("DROP TABLE IF EXISTS suggestion_votes CASCADE;");
      console.log("Tabele usunięte. Rozpoczynanie tworzenia nowego schematu...");
    }

    // 1. Tabela users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela rooms
    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tabela room_members
    await client.query(`
      CREATE TABLE IF NOT EXISTS room_members (
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (room_id, user_id)
      );
    `);

    // 4. Tabela trips
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        owner VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        budget NUMERIC(12, 2) DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Tabela itinerary
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

    // 6. Tabela expenses
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

    // 7. Tabela suggestions
    await client.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(512),
        suggested_by VARCHAR(255)
      );
    `);

    // 8. Tabela checklist
    await client.query(`
      CREATE TABLE IF NOT EXISTS checklist (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        task VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        assignee VARCHAR(255)
      );
    `);

    // 9. Tabela trip_votes
    await client.query(`
      CREATE TABLE IF NOT EXISTS trip_votes (
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (trip_id, user_id)
      );
    `);

    // 10. Tabela suggestion_votes
    await client.query(`
      CREATE TABLE IF NOT EXISTS suggestion_votes (
        suggestion_id INTEGER REFERENCES suggestions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (suggestion_id, user_id)
      );
    `);

    console.log("Inicjalizacja schematu bazy danych zakończona sukcesem.");
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
