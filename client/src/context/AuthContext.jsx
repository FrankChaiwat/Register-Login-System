import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. อ่านข้อมูลจาก localStorage ตอนโหลดเว็บครั้งแรก เพื่อให้จำสถานะการล็อกอินได้
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const userData = response.data.user;
      
      setCurrentUser(userData);
      // 2. บันทึกข้อมูลลง localStorage เมื่อ Login สำเร็จ
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      alert(error.response?.data?.error || 'Login ล้มเหลว');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('http://localhost:5000/api/register', { username, email, password });
      return true;
    } catch (error) {
      alert(error.response?.data?.error || 'Register ล้มเหลว');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    // 3. ลบข้อมูลออกจาก localStorage เมื่อกด Logout
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);