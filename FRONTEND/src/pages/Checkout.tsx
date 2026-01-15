import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  // คำนวณยอดรวม (รองรับกรณีมี Quantity)
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ');
      navigate('/login');
      return;
    }

    if (cart.length === 0) return alert('ตะกร้าว่างเปล่า!');
    if (!file) return alert('⚠️ กรุณาแนบสลิปโอนเงินก่อนกดยืนยันครับ');

    // ถามยืนยัน
    if (!confirm(`ยืนยันการสั่งซื้อยอดรวม ฿${total.toLocaleString()}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // ส่งข้อมูลรายการสินค้า
      formData.append('items', JSON.stringify(cart));
      // ส่งไฟล์สลิป
      formData.append('file', file);

      await axios.post('http://localhost:3000/orders/bulk', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('🎉 สั่งซื้อสำเร็จ! ระบบกำลังตรวจสอบสลิปของคุณ');
      clearCart(); 
      navigate('/my-orders'); 

    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
        🛒 ตะกร้าสินค้า & ชำระเงิน
      </h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒💨</div>
          <h3>ตะกร้าสินค้าว่างเปล่า</h3>
          <Link to="/">
            <button className="nav-btn btn-primary" style={{ marginTop: '20px' }}>
              ไปเลือกซื้อสินค้า
            </button>
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          
          {/* --- ฝั่งซ้าย: รายการสินค้า --- */}
          <div className="cart-items">
            <table className="cart-table">
              <tbody>
                {cart.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="cart-item-row">
                    <td style={{ width: '100px' }}>
                      <img 
                        src={`http://localhost:3000/uploads/${item.image}`} 
                        alt={item.title} 
                        className="cart-img"
                      />
                    </td>
                    <td>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.title}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        จำนวน: {item.quantity || 1}
                      </p>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                      ฿{(item.price * (item.quantity || 1)).toLocaleString()}
                    </td>
                    <td style={{ width: '50px', textAlign: 'center' }}>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                        title="ลบรายการ"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- ฝั่งขวา: สรุปยอด + โอนเงิน --- */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3 style={{ marginTop: 0 }}>สรุปคำสั่งซื้อ</h3>
              
              <div className="summary-total">
                <span>ยอดรวมสุทธิ</span>
                <span style={{ color: '#6f42c1' }}>฿{total.toLocaleString()}</span>
              </div>

              {/* ส่วนข้อมูลธนาคาร */}
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px', border: '1px dashed #ccc' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#333' }}>💳 โอนเงินเข้าบัญชี</h4>
                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '5px' }}>
                  ธ.กสิกรไทย (KBANK)
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', fontFamily: 'monospace' }}>
                  123-4-56789-0
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>บจก. Lecture Clubhouse</div>
              </div>

              {/* ส่วนแนบสลิป */}
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                  หลักฐานการโอนเงิน (Slip)
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ width: '100%', fontSize: '0.9rem' }}
                />
              </div>

              <button onClick={handleCheckout} className="btn-checkout">
                แจ้งชำระเงินทันที ✅
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}