// models/createTables.js
const pool = require('../config/db');

const createTables = async () => {
    try {
        // 1. Create Users Table (with phone)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(50) DEFAULT 'citizen', 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Users table created');

        // Add phone column if it doesn't exist (for existing tables)
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
        `);
        console.log('✅ Phone column ensured on users');

        // 2. Create Reports Table (with status)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(255),
                category VARCHAR(50) DEFAULT 'pending', 
                status VARCHAR(20) DEFAULT 'open',
                image_url TEXT,
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Reports table created');

        // Add status column if it doesn't exist (for existing tables)
        await pool.query(`
            ALTER TABLE reports ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'open';
        `);
        console.log('✅ Status column ensured on reports');

        // 3. Create Applications Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
                worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(report_id, worker_id)
            );
        `);
        console.log('✅ Applications table created');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        pool.end();
    }
};

createTables();