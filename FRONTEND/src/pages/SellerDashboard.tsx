import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Product, SoldItem } from '../types'; // ✅ Import Types กลาง

function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State สำหรับบัญชีธนาคาร
  const [bankInfo, setBankInfo] = useState({ bankName: '', bankAccountNumber: '' });
  const [isEditingBank, setIsEditingBank] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // คำนวณยอดเงิน
  const [serverTotalIncome, setServerTotalIncome] = useState(0);
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]); // ✅ ใช้ Type SoldItem แทน any

  // 1. โหลดข้อมูลจริงจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ของเก่า (payouts) อาจจะไม่ได้ใช้แล้ว แต่เก็บไว้ก่อนเผื่อมีอะไรพัง
        // const resPayouts = await axios.get('http://localhost:3000/orders/payouts/my', authHeader);
        // setPayouts(resPayouts.data);

        // ✅ เพิ่ม: ดึงยอดเงิน + ประวัติสินค้า จาก API ใหม่ที่เราเพิ่งแก้
        const resIncome = await axios.get('http://localhost:3001/orders/income', authHeader);
        setServerTotalIncome(resIncome.data.totalIncome);
        setSoldItems(resIncome.data.soldItems); // เก็บรายการสินค้าลง State

        const resProfile = await axios.get('http://localhost:3001/users/profile', authHeader);
        setBankInfo({
          bankName: resProfile.data.bankName || '',
          bankAccountNumber: resProfile.data.bankAccountNumber || ''
        });

        const resProducts = await axios.get('http://localhost:3001/products/my-products', authHeader);
        setMyProducts(resProducts.data);

      } catch (err: any) {
        console.error("Error fetching data:", err);

        // ✅ เพิ่ม Auto-Logout ถ้า Token หมดอายุ (401)
        if (err.response && err.response.status === 401) {
          alert('⏳ เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login'; // ใช้ banned method นิดนึงเพื่อให้ refresh state ชัวร์ๆ
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. ฟังก์ชันบันทึกเลขบัญชี
  const handleSaveBank = async () => {
    try {
      await axios.patch('http://localhost:3001/users/bank-info', bankInfo, authHeader);
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
      await axios.delete(`http://localhost:3001/products/${id}`, authHeader);
      alert('✅ ลบเรียบร้อย!');
      setMyProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('❌ ลบไม่ได้: เกิดข้อผิดพลาด');
    }
  };

  // ใช้ค่าจาก Server ถ้ามี
  const totalPaid = serverTotalIncome;

  // ใช้จำนวนจาก soldItems
  const totalSoldItems = soldItems.length;

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
                onChange={e => setBankInfo({ ...bankInfo, bankName: e.target.value })}
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
                onChange={e => setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })}
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
            {totalSoldItems} รายการ
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
            {myProducts.map(product => (
              <div key={product.id} className="manage-card">
                <img
                  src={`http://localhost:3001/uploads/${product.image}`}
                  alt={product.title}
                />
                <div className="manage-card-body">
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                  </h3>
                  <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ฿{product.price.toLocaleString()}
                  </div>

                  <div className="manage-card-actions">
                    <Link to={`/edit/${product.id}`} className="btn-edit">
                      ✏️ แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
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

      {/* --- ส่วนที่ 4: ตารางประวัติรายได้ (แก้ให้ใช้ soldItems) --- */}
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
                  <th style={{ padding: '15px', textAlign: 'left' }}>สินค้า</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>จำนวนเงิน</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {soldItems.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>ยังไม่มีรายการขาย</td></tr>
                ) : soldItems.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    {/* แสดงชื่อสินค้า และ Order ID */}
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>Order #{item.orderId}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>
                        ขาย: ฿{Number(item.price).toLocaleString()}
                      </div>
                      <div style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                        หัก 5%: -฿{item.fee ? Number(item.fee).toLocaleString() : '0'}
                      </div>
                      <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        รับ: ฿{item.netPrice ? Number(item.netPrice).toLocaleString() : Number(item.price).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        background: item.status === 'PAID' ? '#d4edda' : '#fff3cd',
                        color: item.status === 'PAID' ? '#155724' : '#856404',
                        fontWeight: '600'
                      }}>
                        {/* ถ้า PAID ให้บอกว่า โอนแล้ว, ถ้ายังก็ รอโอน */}
                        {item.status === 'PAID' ? '✅ โอนแล้ว' : '⏳ รอโอน'}
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
