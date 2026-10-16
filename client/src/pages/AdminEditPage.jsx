import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminEditPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // เช็คสิทธิ์ว่าเป็น Admin หรือไม่ ถ้าไม่ใช่ให้ดีดกลับหน้า Users
    if (!currentUser || !currentUser.isAdmin) {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      navigate('/users');
      return;
    }

    // ดึงข้อมูล User คนที่จะแก้ไขมาแสดงในฟอร์ม
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        const targetUser = res.data.find(u => u.id === parseInt(id));
        if (targetUser) {
          setUsername(targetUser.username);
          setEmail(targetUser.email);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, currentUser, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}`, {
        email,
        password // ถ้าปล่อยว่างไว้ ฝั่ง Backend จะไม่อัปเดตรหัสผ่านเดิม
      });
      alert('อัปเดตข้อมูลสำเร็จ!');
      navigate('/users');
    } catch (error) {
      alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>แก้ไขข้อมูลผู้ใช้ 🛠️</h2>
        <p className="auth-subtitle">กำลังแก้ไขข้อมูลของ: <strong>{username}</strong></p>
        
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>New Password (เว้นว่างไว้ถ้าไม่เปลี่ยน)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn-submit" style={{ marginBottom: '10px' }}>
            บันทึกการเปลี่ยนแปลง
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/users')} 
            style={{ width: '100%', padding: '10px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
}