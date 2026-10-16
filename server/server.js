const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ฟังก์ชันสำหรับสร้างบัญชี Admin จาก .env โดยอัตโนมัติเมื่อเปิด Server
const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('⚠️ ไม่พบการตั้งค่า ADMIN_EMAIL หรือ ADMIN_PASSWORD ในไฟล์ .env');
    return;
  }

  try {
    // 1. ตรวจสอบว่ามีอีเมลนี้ในฐานข้อมูลหรือยัง
    const checkAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

    if (checkAdmin.rows.length === 0) {
      // 2. ถ้ายังไม่มี ให้ทำการแฮชรหัสผ่านและบันทึกลง Database
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        ['Administrator', adminEmail, hashedPassword]
      );
      
      console.log(`✅ สร้างบัญชี Admin (${adminEmail}) สำเร็จเรียบร้อยแล้ว!`);
    } else {
      console.log(`ℹ️ บัญชี Admin (${adminEmail}) มีอยู่ในระบบอยู่แล้ว`);
    }
  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาดในการสร้าง Admin อัตโนมัติ:', err.message);
  }
};

// --- API ต่างๆ ในระบบ ---

// 1. API สมัครสมาชิก (Register)
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    res.json({ message: 'สมัครสมาชิกสำเร็จ', user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว หรือเกิดข้อผิดพลาด' });
  }
});

// 2. API เข้าสู่ระบบ (Login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'ไม่พบอีเมลนี้ในระบบ' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบสิทธิ์ Admin เทียบกับ .env
    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    const { password: _, ...userData } = user;
    res.json({ 
      message: 'เข้าสู่ระบบสำเร็จ', 
      user: { ...userData, isAdmin } 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. API ดึงรายชื่อ User ทั้งหมด
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY id ASC');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. API สำหรับ Admin แก้ไขข้อมูลผู้ใช้ (Email / Password)
app.put('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    if (password && password.trim() !== '') {
      // ถ้ามีการกรอกรหัสผ่านใหม่ ให้แฮชรหัสผ่านใหม่ด้วย
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET email = $1, password = $2 WHERE id = $3',
        [email, hashedPassword, id]
      );
    } else {
      // ถ้าไม่ได้กรอกรหัสผ่านใหม่ให้อัปเดตแต่อีเมล
      await pool.query(
        'UPDATE users SET email = $1 WHERE id = $2',
        [email, id]
      );
    }
    res.json({ message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้ อีเมลอาจซ้ำกับผู้ใช้อื่น' });
  }
});

// 5. API สำหรับ Admin ลบผู้ใช้งาน (Delete User)
app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'ลบผู้ใช้งานสำเร็จ' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'ไม่สามารถลบผู้ใช้งานได้' });
  }
});

// เปิดใช้งาน Server และสั่งรันฟังก์ชันสร้าง Admin
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await createDefaultAdmin();
});