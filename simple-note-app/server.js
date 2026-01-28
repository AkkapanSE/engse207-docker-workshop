const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// 1. ตั้งค่าการเชื่อมต่อ PostgreSQL
// ใช้ host: 'note-db' เพื่อให้ Docker คุยกันผ่านชื่อ Container ใน Network เดียวกัน
const pool = new Pool({
  host: 'note-db',
  user: 'noteuser',
  password: 'notepass',
  database: 'notedb',
  port: 5432,
});

// 2. ฟังก์ชันเริ่มต้น Database (สร้าง Table ถ้ายังไม่มี)
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized & Connected to PostgreSQL');
  } catch (err) {
    console.error('❌ Database connection error:', err.stack);
    // ถ้าเชื่อมต่อไม่ได้ ให้ลองใหม่ทุกๆ 5 วินาที (ป้องกันแอปตายก่อน DB พร้อม)
    setTimeout(initDb, 5000);
  }
};

initDb();

// 3. API Routes

// GET: ดึงโน้ตทั้งหมดจาก DB
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows, count: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: เพิ่มโน้ตใหม่เข้า DB
app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health Check
app.get('/health', (req, res) => res.send('OK'));

// 4. สั่งรัน Server (ระบุ 0.0.0.0 เพื่อให้ Docker รับงานจากภายนอกได้)
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║        📝 Simple Note App - Docker Workshop        ║
╠════════════════════════════════════════════════════╣
║  🚀 Server running on http://0.0.0.0:${PORT}          ║
║  📂 Storage: PostgreSQL (Container: note-db)       ║
╚════════════════════════════════════════════════════╝
  `);
});