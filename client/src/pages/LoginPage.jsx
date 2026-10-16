import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/users');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>ยินดีต้อนรับกลับมา 👋</h2>
        <p className="auth-subtitle">กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ</p>
        
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-submit">Sign In</button>
        </form>

        <p className="auth-footer">
          ยังไม่มีบัญชีใช่ไหม? <Link to="/register">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}