import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);

      const token = response.data.access_token || response.data.token;
      const user = response.data.user; 

      if (!token) throw new Error("ไม่พบ Token");

      // 🛠️ Logic เดิม: ปรับ Role ให้เป็นตัวพิมพ์เล็ก และแปลง BUYER -> user
      let role = user?.role ? user.role.toLowerCase() : 'user';
      if (role === 'buyer') role = 'user'; 

      const safeUser = { ...user, role }; 

      // บันทึกลง Storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', safeUser.role);

      // อัปเดต Context
      if (login) {
        login(safeUser, token);
      }

      alert(`✅ ยินดีต้อนรับคุณ ${safeUser.username}`);

      // 🚀 Redirect ตาม Role (Logic เดิม)
      if (safeUser.role === 'admin') {
        navigate('/admin');
      } else if (safeUser.role === 'seller') {
        navigate('/seller-dashboard'); 
      } else {
        navigate('/'); // userทั่วไป
      }

    } catch (error: any) {
      console.error("❌ Login Error:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      
      {/* 👇👇👇 เพิ่มหัวข้อใหญ่ตรงนี้ 👇👇👇 */}
      <h1 className="main-title">
        Lecture Clubhouse 🏡💖
      </h1>

      <div className="auth-card">
        {/* หัวข้อสวยๆ */}
        <h2 className="auth-title">ยินดีต้อนรับกลับ 👋</h2>
        <p className="auth-subtitle">เข้าสู่ระบบเพื่อจัดการร้านค้าและคำสั่งซื้อ</p>
        
        {/* กล่อง Error Message */}
        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">ชื่อผู้ใช้ (Username)</label>
            <input 
              type="text" 
              name="username" 
              className="form-input" // ใช้ Class สวยๆ
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
              value={formData.username}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" // ใช้ Class สวยๆ
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn" // ใช้ Class ปุ่ม Gradient
            disabled={isLoading}
          >
            {isLoading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Link ไปหน้าสมัครสมาชิก */}
        <div className="auth-footer">
          ยังไม่มีบัญชีใช่ไหม? <Link to="/register" className="auth-link">สมัครสมาชิก</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;