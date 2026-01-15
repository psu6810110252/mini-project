// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      textAlign: 'center',
      padding: '20px'
    }}>
      {/* โลโก้หรือไอคอนใหญ่ๆ */}
      <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🏡</div>

      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: '800', 
        background: 'linear-gradient(45deg, #6f42c1, #ff7e5f)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px'
      }}>
        Lecture Clubhouse
      </h1>

      <p style={{ fontSize: '1.5rem', color: '#555', maxWidth: '600px', lineHeight: '1.6' }}>
        แหล่งรวมชีทสรุปคุณภาพสูงจากติวเตอร์ชั้นนำ <br/>
        ช่วยให้การเรียนและการสอบของคุณง่ายขึ้น
      </p>

      <div style={{ marginTop: '40px' }}>
        {/* ถ้าเป็นคนขายหรือแอดมิน ให้ไปหน้า Dashboard ของตัวเอง */}
        {user?.role === 'seller' ? (
           <Link to="/seller-dashboard">
             <button className="nav-btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.3rem', borderRadius: '50px' }}>
               🛠️ ไปที่แผงควบคุม
             </button>
           </Link>
        ) : user?.role === 'admin' ? (
           <Link to="/admin">
             <button className="nav-btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.3rem', borderRadius: '50px' }}>
               👮‍♂️ ไปที่หน้า Admin
             </button>
           </Link>
        ) : (
           /* ถ้าเป็นคนทั่วไป หรือคนซื้อ ให้ไปหน้าร้านค้า */
           <Link to="/shop">
             <button className="nav-btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.3rem', borderRadius: '50px' }}>
               🚀 เข้าสู่ร้านค้า (Shop)
             </button>
           </Link>
        )}
      </div>

      {/* Feature เล็กๆ ด้านล่าง */}
      <div style={{ display: 'flex', gap: '30px', marginTop: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={featureBoxStyle}>
          <h3>📚 เนื้อหาครบ</h3>
          <p>ครอบคลุมทุกวิชา ม.ปลาย และมหาวิทยาลัย</p>
        </div>
        <div style={featureBoxStyle}>
          <h3>⚡ โหลดไว</h3>
          <p>ชำระเงินปุ๊บ ได้ไฟล์ทันที ไม่ต้องรอส่งของ</p>
        </div>
        <div style={featureBoxStyle}>
          <h3>🔒 ปลอดภัย</h3>
          <p>ระบบชำระเงินตรวจสอบสลิปแม่นยำ 100%</p>
        </div>
      </div>
    </div>
  );
}

const featureBoxStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
  width: '200px'
};