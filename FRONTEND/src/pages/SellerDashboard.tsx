import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface Payout {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  order: { id: number; };
}

function SellerDashboard() {
  const { user } = useAuth(); // ดึงชื่อ user มาโชว์
  const navigate = useNavigate();
  
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับบัญชีธนาคาร
  const [bankInfo, setBankInfo] = useState({ bankName: '', bankAccountNumber: '' });
  const [isEditingBank, setIsEditingBank] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // 1. โหลดข้อมูลจริงจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPayouts = await axios.get('http://localhost:3000/orders/payouts/my', authHeader);
        setPayouts(resPayouts.data);

        const resProfile = await axios.get('http://localhost:3000/users/profile', authHeader);
        setBankInfo({
          bankName: resProfile.data.bankName || '',
          bankAccountNumber: resProfile.data.bankAccountNumber || ''
        });

        const resProducts = await axios.get('http://localhost:3000/products/my-products', authHeader);
        setMyProducts(resProducts.data);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. ฟังก์ชันบันทึกเลขบัญชี
  const handleSaveBank = async () => {
    try {
      await axios.patch('http://localhost:3000/users/bank-info', bankInfo, authHeader);
      alert('✅ บันทึกข้อมูลธนาคารเรียบร้อย');
      setIsEditingBank(false);
    } catch (err) {
      alert('❌ บันทึกไม่สำเร็จ');
    }
  };

  // 3. ฟังก์ชันลบสินค้า
  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันที่จะลบ Lecture นี้ใช่ไหม?')) return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`, authHeader);
      alert('✅ ลบเรียบร้อย!');
      setMyProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('❌ ลบไม่ได้: เกิดข้อผิดพลาด');
    }
  };

  // คำนวณยอดเงิน
  const totalPaid = payouts
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="dashboard-container">
      
      {/* --- Header (เอาปุ่มออกแล้ว) --- */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">🛠️ แผงควบคุมผู้ขาย</h1>
        <p className="dashboard-subtitle">สวัสดีคุณ <b>{user?.username}</b> จัดการร้านค้าและรายได้ของคุณได้ที่นี่</p>
      </div>

      {/* --- ส่วนที่ 1: ข้อมูลรับเงิน (ดีไซน์ใหม่) --- */}
      <div className="dashboard-card">
        <div className="section-header">
          <div className="section-title">
            🏦 ข้อมูลบัญชีรับเงิน
          </div>
          <button 
            onClick={() => isEditingBank ? handleSaveBank() : setIsEditingBank(true)}
            className={isEditingBank ? "nav-btn btn-primary" : "nav-btn btn-outline"}
          >
            {isEditingBank ? '💾 บันทึก' : '✏️ แก้ไขข้อมูล'}
          </button>
        </div>

        {isEditingBank ? (
          // โหมดแก้ไข (แสดง Input)
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label className="form-label">ธนาคาร</label>
              <select 
                className="form-input"
                value={bankInfo.bankName}
                onChange={e => setBankInfo({...bankInfo, bankName: e.target.value})}
              >
                <option value="">-- เลือกธนาคาร --</option>
                <option value="KBANK">กสิกรไทย (KBANK)</option>
                <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                <option value="KTB">กรุงไทย (KTB)</option>
                <option value="BBL">กรุงเทพ (BBL)</option>
                <option value="TTB">ทหารไทยธนชาต (TTB)</option>
              </select>
            </div>
            <div>
              <label className="form-label">เลขที่บัญชี</label>
              <input 
                type="text" 
                className="form-input"
                value={bankInfo.bankAccountNumber}
                onChange={e => setBankInfo({...bankInfo, bankAccountNumber: e.target.value})}
                placeholder="xxx-x-xxxxx-x"
              />
            </div>
          </div>
        ) : (
          // โหมดแสดงผล (แสดง Text สวยๆ)
          <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
            <div>
              <label style={{ color: '#888', fontSize: '0.9rem' }}>ธนาคาร</label>
              <div style={{ fontSize: '1.2rem', fontWeight: '500', color: '#333' }}>
                {bankInfo.bankName || '- ไม่ระบุ -'}
              </div>
            </div>
            <div>
              <label style={{ color: '#888', fontSize: '0.9rem' }}>เลขบัญชี</label>
              <div style={{ fontSize: '1.2rem', fontWeight: '500', fontFamily: 'monospace', color: '#333' }}>
                {bankInfo.bankAccountNumber || '- ไม่ระบุ -'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- ส่วนที่ 2: สรุปยอดเงิน (Cards) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="dashboard-card" style={{ marginBottom: 0, borderLeft: '5px solid #28a745', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '1rem' }}>รายได้ทั้งหมด (Paid)</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            ฿{totalPaid.toLocaleString()}
          </div>
        </div>
        <div className="dashboard-card" style={{ marginBottom: 0, borderLeft: '5px solid #17a2b8', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '1rem' }}>จำนวนสินค้าที่ขายได้</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
            {payouts.length} รายการ
          </div>
        </div>
      </div>

      {/* --- ส่วนที่ 3: จัดการสินค้า (Product Grid) --- */}
      <div className="dashboard-card">
        <div className="section-header">
          <div className="section-title">
            📦 Lecture ที่ลงขาย ({myProducts.length})
          </div>
          <Link to="/add-product">
            <button className="nav-btn btn-primary">
              + ลงขาย Lecture ใหม่
            </button>
          </Link>
        </div>

        {myProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>ยังไม่มีสินค้าที่ลงขาย</p>
            <Link to="/add-product" style={{ color: '#6f42c1', fontWeight: 'bold' }}>เริ่มขายเลย!</Link>
          </div>
        ) : (
          <div className="product-manager-grid">
            {myProducts.map(p => (
              <div key={p.id} className="manage-card">
                <img 
                  src={`http://localhost:3000/uploads/${p.image}`} 
                  alt={p.title} 
                  className="manage-card-img"
                />
                <div className="manage-card-body">
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.title}
                  </h3>
                  <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ฿{p.price.toLocaleString()}
                  </div>
                  
                  <div className="manage-card-actions">
                    <Link to={`/edit/${p.id}`} className="btn-edit">
                      ✏️ แก้ไข
                    </Link>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="btn-delete"
                    >
                      🗑️ ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ส่วนที่ 4: ตารางประวัติรายได้ --- */}
      <div className="dashboard-card">
        <div className="section-header">
          <div className="section-title">📜 ประวัติรายได้ล่าสุด</div>
        </div>

        {loading ? <p>กำลังโหลด...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', color: '#555', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>วันที่</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>จำนวนเงิน</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>ยังไม่มีรายการขาย</td></tr>
                ) : payouts.map(payout => (
                  <tr key={payout.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>{new Date(payout.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '15px' }}>#{payout.order?.id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>฿{Number(payout.amount).toLocaleString()}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        background: payout.status === 'PAID' ? '#d4edda' : '#fff3cd',
                        color: payout.status === 'PAID' ? '#155724' : '#856404',
                        fontWeight: '600'
                      }}>
                        {payout.status === 'PENDING' ? '⏳ รอโอน' : '✅ โอนแล้ว'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default SellerDashboard;