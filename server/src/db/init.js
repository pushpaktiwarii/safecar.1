const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some hosted PostgreSQL like Render
  }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS qr_profiles (
        qr_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        owner_name TEXT,
        emergency_contacts TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        city TEXT,
        blood_group TEXT,
        vehicle_type TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        qr_id TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        location TEXT,
        FOREIGN KEY(qr_id) REFERENCES qr_profiles(qr_id)
      )
    `);

    console.log("PostgreSQL Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

// Export `db` as the pool object, which has `query` method.
module.exports = { db: pool, initDb };
