import { useState, useEffect } from 'react';
import axios from 'axios';

interface OrderItem {
  id: number;
  product: {
    id: number;
    title: string;
    image: string;
  };
  price: number;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>📦 ประวัติการสั่งซื้อของฉัน</h1>
      </div>

      {loading ? <p>กำลังโหลด...</p> : orders.length === 0 ? (
        <p>คุณยังไม่มีประวัติการสั่งซื้อ</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              
              {/* ส่วนหัวของ Order */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <span style={{ marginLeft: '10px', color: '#888', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  สถานะ: 
                  <span style={{ 
                    fontWeight: 'bold', 
                    marginLeft: '5px',
                    color: order.status === 'APPROVED' ? 'green' : (order.status === 'PENDING' ? 'orange' : 'red') 
                  }}>
                    {order.status === 'APPROVED' ? '✅ อนุมัติแล้ว' : (order.status === 'PENDING' ? '⏳ รอตรวจสอบ' : '❌ ยกเลิก')}
                  </span>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div>
                {order.orderItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    {/* รูปสินค้า */}
                    <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '5px', overflow: 'hidden', flexShrink: 0 }}>
                      {item.product && item.product.image ? (
                        <img src={`http://localhost:3000/uploads/${item.product.image}`} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📚</div>
                      )}
                    </div>
                    
                    {/* รายละเอียด */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.product ? item.product.title : 'สินค้าถูกลบ'}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>ราคา: ฿{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ยอดรวม */}
              <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold' }}>
                ราคารวม: ฿{order.totalPrice.toLocaleString()}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}