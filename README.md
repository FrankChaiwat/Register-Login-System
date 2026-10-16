# Full-Stack User Management & Admin Dashboard

ระบบจัดการผู้ใช้งานแบบ Full-Stack ด้วย **React (Vite)**, **Node.js (Express)** และ **PostgreSQL** มาพร้อมกับระบบ Authentication (Login/Register), ระบบแยกสิทธิ์ผู้ใช้งาน (Admin Authorization), การจดจำ session ผ่าน `localStorage` และการ Auto-Seed บัญชีผู้ดูแลระบบ (Admin) จากไฟล์ `.env`

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
register login/
├── client/                      # โฟลเดอร์ระบบหน้าบ้าน (Frontend - React + Vite)
│   ├── node_modules/           # แพ็กเกจและไลบรารีของ Client
│   ├── public/                 # ไฟล์ Static assets (favicon, icons)
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/                    # ซอร์สโค้ดหลักของ React
│   │   ├── assets/             # รูปภาพ หรือไฟล์สื่ออื่นๆ
│   │   ├── context/            # Global State Management
│   │   │   └── AuthContext.jsx # Context จัดการล็อกอิน, ล็อกเอาท์ และ localStorage
│   │   ├── pages/              # หน้าเว็บหลักของแอปพลิเคชัน
│   │   │   ├── AdminEditPage.jsx # หน้าฟอร์มแก้ไขข้อมูลผู้ใช้ (Admin สิทธิ์สูง)
│   │   │   ├── LoginPage.jsx     # หน้าเข้าสู่ระบบ
│   │   │   ├── RegisterPage.jsx  # หน้าสมัครสมาชิกใหม่
│   │   │   └── UsersPage.jsx     # หน้าตารางแสดงรายชื่อผู้ใช้ทั้งหมด
│   │   ├── App.css             # สไตล์หลักของแอปพลิเคชัน
│   │   ├── App.jsx             # กำหนด Router และเส้นทาง (Routes) ทั้งหมด
│   │   ├── index.css           # สไตล์ภาพรวมระดับ Global
│   │   └── main.jsx            # จุดเริ่มต้นการ Render React App
│   ├── .oxlintrc.json          # ไฟล์ตั้งค่า Linter
│   ├── index.html              # ไฟล์ HTML หลัก
│   ├── package-lock.json       # ล็อกเวอร์ชันแพ็กเกจของ Client
│   ├── package.json            # รายการแพ็กเกจและคำสั่งรันของ Client
│   ├── README.md               # เอกสารแนะนำของ Client
│   └── vite.config.js          # ตั้งค่าการทำงานของ Vite
│
├── server/                      # โฟลเดอร์ระบบหลังบ้าน (Backend - Node.js + Express)
│   ├── .env                    # ไฟล์เก็บค่าความลับ (Database/Admin credentials - ไม่ดันขึ้น Git)
│   ├── .env.example            # ไฟล์ตัวอย่างโครงสร้างคีย์ใน .env
│   └── server.js               # เซิร์ฟเวอร์หลัก (API Routes, DB Connection, Admin Auto-seed)
│
├── .gitignore                   # ไฟล์ระบุชื่อไฟล์/โฟลเดอร์ที่ไม่ต้องดันขึ้น GitHub
└── README.md                    # เอกสารคู่มือโปรเจกต์ฉบับเต็ม
```

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

### **Frontend (`client/`)**
* **Framework & Build Tool:** React + Vite
* **Routing:** `react-router-dom` (จัดการ Client-side routing & Protected Routes)
* **HTTP Client:** `axios` (ส่ง Request ไปยัง REST API)
* **Styling:** Custom CSS (Modern UI Design)

### **Backend (`server/`)**
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database Driver:** `pg` (PostgreSQL client)
* **Security & Auth:** `bcrypt` (สำหรับ Hashing Password)
* **Config:** `dotenv` (จัดการ Environment Variables)
* **CORS:** `cors` (อนุญาตการเข้าถึงระหว่าง Domain)

---

## ⚡ ฟีเจอร์หลักของระบบ (Key Features)

1. **Authentication System:**
   - **Register:** สมัครสมาชิกใหม่ แฮชรหัสผ่านก่อนบันทึกลงฐานข้อมูล
   - **Login:** ยืนยันตัวตน และส่งสถานะผู้ใช้กลับมา
   - **Auth Persistence:** ใช้ `localStorage` ร่วมกับ `AuthContext` เพื่อรักษาสถานะการเข้าสู่ระบบแม้จะทำการ Refresh หน้าเว็บ

2. **Automated Admin Seeding:**
   - ระบบตรวจสอบและสร้างบัญชี Admin จาก `.env` อัตโนมัติเมื่อเปิดเซิร์ฟเวอร์ (`server.js`) หากยังไม่มีอีเมลนั้นในระบบ

3. **Admin Dashboard & CRUD Operations:**
   - ดึงและแสดงรายชื่อผู้ใช้งานทั้งหมด
   - **Admin Only Action:** ผู้ดูแลระบบสามารถแก้ไข (Update) อีเมล/รหัสผ่าน และ ลบ (Delete) ผู้ใช้งานออกจากระบบได้ผ่าน API `/api/admin/users/:id`

---

## 🚀 ขั้นตอนการติดตั้งและการรันระบบ (Installation & Getting Started)

### 1. การตั้งค่าฐานข้อมูล PostgreSQL
สร้างฐานข้อมูลใน PostgreSQL ชื่อ `postgres` (หรือตามที่คุณกำหนด) และสร้างตาราง `users`:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. การตั้งค่าฝั่ง Backend (`server/`)

1. เข้าไปยังโฟลเดอร์ `server/`:
   ```bash
   cd server
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` และกำหนดค่าดังนี้:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_db_password
   DB_NAME=postgres
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=AdminPassword123
   ```
4. เริ่มรัน Backend Server:
   ```bash
   node server.js
   ```

---

### 3. การตั้งค่าฝั่ง Frontend (`client/`)

1. เข้าไปยังโฟลเดอร์ `client/`:
   ```bash
   cd client
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. รันโปรเจกต์ Frontend:
   ```bash
   npm run dev
   ```
4. เปิดเบราว์เซอร์ไปที่ URL ตามที่ Vite แจ้งไว้ (เช่น `http://localhost:5173`)

---

## 🛰 รายละเอียด API Endpoints (`server.js`)

| Method | Endpoint | Description | Permisson |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/register` | สมัครสมาชิกใหม่ | Public |
| **POST** | `/api/login` | เข้าสู่ระบบ | Public |
| **GET** | `/api/users` | ดึงรายชื่อผู้ใช้ทั้งหมด | Authenticated |
| **PUT** | `/api/admin/users/:id` | แก้ไขข้อมูลผู้ใช้งาน (Email/Password) | Admin Only |
| **DELETE** | `/api/admin/users/:id` | ลบผู้ใช้งานออกจากระบบ | Admin Only |