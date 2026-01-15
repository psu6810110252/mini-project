import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // 🚫 ไม่แสดง Navbar ในหน้า Login และ Register
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 🛠️ กำหนดว่า Logo ควรลิ้งค์ไปไหน?
  // Seller -> Dashboard, Admin -> Admin Panel, คนทั่วไป -> หน้าแรก
  const logoLink = user?.role === 'seller' ? '/seller-dashboard' : user?.role === 'admin' ? '/admin' : '/';

  return (
    <nav className="navbar">
      {/* โลโก้ซ้ายมือ (ลิ้งค์ไปหน้า Dashboard ของแต่ละคน) */}
      <Link to={logoLink} className="navbar-brand">
        🏡 Lecture Clubhouse
      </Link>

      {/* เมนูขวามือ */}
      <div className="navbar-menu">
        
        {/* ✅ เมนู "หน้าแรก": แสดงเฉพาะ คนที่ "ไม่ใช่" Seller และ "ไม่ใช่" Admin */}
        {user?.role !== 'seller' && user?.role !== 'admin' && (
          <Link to="/" className="nav-link">หน้าแรก</Link>
        )}

        {user ? (
          // --- กรณีล็อกอินแล้ว ---
          <>
            {user.role === 'seller' ? (
              // 👨‍💼 เมนูสำหรับ "ผู้ขาย (Seller)"
              <>
                <Link to="/seller-dashboard" className="nav-link" style={{ color: '#e67e22', fontWeight: 'bold' }}>
                  🛠️ แผงควบคุม & ประวัติการขาย
                </Link>
              </>
            ) : user.role === 'admin' ? (
              // 👮‍♂️ เมนูสำหรับ "แอดมิน (Admin)"
              <>
                <Link to="/admin" className="nav-link" style={{ color: '#d35400', fontWeight: 'bold' }}>
                  👮‍♂️ จัดการระบบ (Admin)
                </Link>
              </>
            ) : (
              // 👤 เมนูสำหรับ "ผู้ซื้อ (Buyer)"
              <>
                <Link to="/my-orders" className="nav-link">
                  📜 ประวัติการสั่งซื้อ
                </Link>
                
                <Link to="/checkout" className="nav-btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  🛒 ตะกร้า 
                  {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </Link>
              </>
            )}

            {/* ส่วนแสดงชื่อและปุ่มออก */}
            <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="user-info">
                👤 {user.username} <span style={{fontSize: '0.8em', color: '#888'}}>({user.role})</span>
              </span>

              <button onClick={handleLogout} className="nav-btn btn-danger">
                ออก
              </button>
            </div>
          </>
        ) : (
          // --- กรณี "ยังไม่ล็อกอิน" (Guest) ---
          <>
            <Link to="/login">
              <button className="nav-btn btn-outline">เข้าสู่ระบบ</button>
            </Link>
            <Link to="/register">
              <button className="nav-btn btn-primary">สมัครสมาชิก</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}