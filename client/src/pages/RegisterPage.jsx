import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password);
    if (success) {
      alert('สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>สร้างบัญชีผู้ใช้ 🚀</h2>
        <p className="auth-subtitle">กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="your_name"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-submit">Create Account</button>
        </form>

        <p className="auth-footer">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบที่นี่</Link>
        </p>
      </div>
    </div>
  );
}