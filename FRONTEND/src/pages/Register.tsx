import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  
  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'BUYER', // ค่าเริ่มต้น
    bankName: '',
    bankAccountNumber: ''
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // เตรียมข้อมูลส่ง (ถ้าไม่ใช่ Seller ไม่ต้องส่งเลขบัญชีไป)
      const payload = { ...formData };
      if (payload.role !== 'SELLER') {
        delete (payload as any).bankName;
        delete (payload as any).bankAccountNumber;
      }

      // ยิง API สมัครสมาชิก
      await axios.post('http://localhost:3000/users/register', payload);
      alert('✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('❌ สมัครไม่ผ่าน: ชื่อผู้ใช้อาจซ้ำหรือระบบมีปัญหา');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="main-title">
        Lecture Clubhouse 🏡💖
      </h1>
      
      <div className="auth-card">
        <h2 className="auth-title">สมัครสมาชิกใหม่ 🚀</h2>
        <p className="auth-subtitle">สร้างบัญชีเพื่อเริ่มต้นใช้งาน</p>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">ชื่อผู้ใช้ (Username)</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="ตั้งชื่อผู้ใช้เท่ๆ"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">รหัสผ่าน (Password)</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
              onChange={handleChange}
              required
            />
          </div>

          {/* ส่วนเลือก Role */}
          <div className="form-group">
            <label className="form-label">สถานะ (Role)</label>
            <select 
              name="role" 
              className="form-input"
              value={formData.role} 
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="BUYER">ผู้ซื้อ (Buyer)</option>
              <option value="SELLER">ผู้ขาย (Seller)</option>
              <option value="ADMIN">ผู้ดูแลระบบ (Admin - Test)</option>
            </select>
          </div>

          {/* ส่วนข้อมูลธนาคาร (โชว์เฉพาะ Seller) */}
          {formData.role === 'SELLER' && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#6f42c1', fontSize: '0.95rem' }}>🏦 ข้อมูลรับเงิน (สำหรับผู้ขาย)</h4>
              
              <div className="form-group">
                <label className="form-label">ชื่อธนาคาร</label>
                <input
                  type="text"
                  name="bankName"
                  className="form-input"
                  placeholder="เช่น KBANK, SCB"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">เลขที่บัญชี</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  className="form-input"
                  placeholder="XXX-X-XXXXX-X"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn">
            ยืนยันการสมัคร
          </button>
        </form>

        <div className="auth-footer">
          มีบัญชีอยู่แล้ว? <Link to="/login" className="auth-link">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;