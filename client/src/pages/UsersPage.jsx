import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UsersPage() {
  const { currentUser, logout } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsersList(res.data))
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`คุณต้องการลบผู้ใช้ "${username}" ใช่หรือไม่?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
      }
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h2>รายชื่อผู้ใช้งานทั้งหมด</h2>
            {currentUser?.isAdmin && <span className="admin-badge">Admin Dashboard</span>}
          </div>
          <div className="user-info">
            <span>สวัสดี, <strong>{currentUser?.username}</strong></span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Joined Date</th>
                {currentUser?.isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td><strong>{user.username}</strong> {user.id === currentUser?.id && '(คุณ)'}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString('th-TH')}</td>
                  {currentUser?.isAdmin && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => navigate(`/admin/edit/${user.id}`)}
                          className="btn-icon-edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.username)}
                          className="btn-icon-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}