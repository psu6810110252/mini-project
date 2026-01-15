import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ประกาศ Interface ให้รองรับข้อมูลที่อาจจะไม่มี (?)
interface Order {
  id: number;
  status: string;
  totalAmount?: number; // อาจจะไม่มี
  slipImage?: string; 
  createdAt: string;
  user?: { username: string }; // อาจจะไม่มี
  items?: { // อาจจะไม่มี
    id: number; 
    product?: { title: string; price: number } // สินค้าอาจจะโดนลบไปแล้ว
  }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING'); 
  const { user } = useAuth();
  const navigate = useNavigate();

  // ดึงข้อมูลคำสั่งซื้อทั้งหมด
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      // ยิงไปที่ /orders
      const res = await axios.get('http://localhost:3000/orders', { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, newStatus: 'PAID' | 'CANCELLED') => {
    if (!confirm(`ยืนยันที่จะเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('✅ อัปเดตสถานะเรียบร้อย!');
      fetchOrders(); 
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  const filteredOrders = orders.filter(o => 
    filter === 'ALL' ? true : o.status === filter
  );

  // ฟังก์ชันช่วยแปลงตัวเลขให้ปลอดภัย (แก้ปัญหา .toLocaleString Error)
  const safeNumber = (num: any) => {
    const n = Number(num);
    return isNaN(n) ? 0 : n;
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">👮‍♂️ Admin Center</h1>
        <p className="dashboard-subtitle">ตรวจสอบสลิปและอนุมัติคำสั่งซื้อ</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        <button 
          onClick={() => setFilter('PENDING')}
          className={filter === 'PENDING' ? 'nav-btn btn-primary' : 'nav-btn btn-outline'}
        >
          ⏳ รอตรวจสอบ ({orders.filter(o => o.status === 'PENDING').length})
        </button>
        <button 
          onClick={() => setFilter('ALL')}
          className={filter === 'ALL' ? 'nav-btn btn-primary' : 'nav-btn btn-outline'}
        >
          📋 ประวัติทั้งหมด
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>กำลังโหลดข้อมูล...</p>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '15px' }}>
          <h3>🎉 เย้! ไม่มีรายการค้างตรวจสอบ</h3>
          <p style={{ color: '#888' }}>คุณทำงานเสร็จหมดแล้ว หรือยังไม่มีคำสั่งซื้อเข้ามา</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredOrders.map(order => (
            <div key={order.id} className="dashboard-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              
              {/* ส่วนที่ 1: ข้อมูลสลิป */}
              <div style={{ flex: '1', minWidth: '250px', textAlign: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>หลักฐานการโอน</h4>
                {order.slipImage ? (
                  <a href={`http://localhost:3000/uploads/${order.slipImage}`} target="_blank" rel="noreferrer">
                    <img 
                      src={`http://localhost:3000/uploads/${order.slipImage}`} 
                      alt="Slip" 
                      style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'zoom-in' }}
                    />
                    <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#6f42c1' }}>🔍 กดเพื่อดูภาพใหญ่</div>
                  </a>
                ) : (
                  <div style={{ padding: '30px', color: '#999', border: '2px dashed #ccc', borderRadius: '8px' }}>
                    ไม่มีภาพสลิป
                  </div>
                )}
              </div>

              {/* ส่วนที่ 2: รายละเอียด Order */}
              <div style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                    <span style={{ 
                      background: order.status === 'PENDING' ? '#fff3cd' : order.status === 'PAID' ? '#d4edda' : '#f8d7da',
                      color: order.status === 'PENDING' ? '#856404' : order.status === 'PAID' ? '#155724' : '#721c24',
                      padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem'
                    }}>
                      {order.status || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  {/* ✅ ป้องกัน Error: User undefined */}
                  <p style={{ margin: '5px 0' }}>👤 <b>ลูกค้า:</b> {order.user?.username || 'Unknown User'}</p>
                  <p style={{ margin: '5px 0' }}>📅 <b>วันที่:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString('th-TH') : '-'}</p>
                  
                  <div style={{ marginTop: '15px', padding: '10px', background: '#f1f1f1', borderRadius: '8px' }}>
                    <strong>รายการสินค้า:</strong>
                    <ul style={{ margin: '5px 0 0 20px', padding: 0, color: '#555' }}>
                      {/* ✅ ป้องกัน Error: Items undefined */}
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <li key={idx}>
                             {/* ✅ ป้องกัน Error: Product undefined */}
                             {item.product?.title || 'สินค้าถูกลบ'} (฿{safeNumber(item.product?.price).toLocaleString()})
                          </li>
                        ))
                      ) : (
                        <li>ไม่พบข้อมูลสินค้า</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                    {/* ✅ ป้องกัน Error: totalAmount undefined */}
                    ยอดรวม: ฿{safeNumber(order.totalAmount).toLocaleString()}
                  </div>

                  {order.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        ❌ ปฏิเสธ
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'PAID')}
                        style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(40, 167, 69, 0.3)' }}
                      >
                        ✅ อนุมัติ (โอนแล้ว)
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}