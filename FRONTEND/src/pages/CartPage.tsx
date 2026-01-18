import { useCart } from '../context/CartContext';
import { useState } from 'react';
import axios from 'axios';

function CartPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [slipImage, setSlipImage] = useState<File | null>(null);

  const handleCheckout = async () => {
    if (!slipImage) return alert("⚠️ กรุณาแนบสลิปก่อนชำระเงินครับ");

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // ส่งสินค้าทั้งตะกร้าเป็น String JSON ไปที่ Backend
      formData.append('items', JSON.stringify(cart));
      formData.append('file', slipImage);

      await axios.post('http://localhost:3001/orders/bulk', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("✅ สั่งซื้อสินค้าในตะกร้าสำเร็จ!");
      clearCart(); // ล้างตะกร้าหลังซื้อเสร็จ
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1>🛒 ตะกร้าสินค้า ({cart.length})</h1>
      {/* ส่วนแสดงรายการสินค้าวนลูปเหมือนเดิม */}
      {cart.length > 0 && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '20px' }}>
          <h3>ยอดรวมทั้งหมด: ฿{totalPrice}</h3>
          <input type="file" onChange={(e) => setSlipImage(e.target.files?.[0] || null)} />
          <button onClick={handleCheckout} style={{ background: '#28a745', color: 'white', padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}>
            ยืนยันชำระเงินทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
}
export default CartPage;