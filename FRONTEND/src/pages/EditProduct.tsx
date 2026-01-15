import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ title: '', description: '', price: 0 });
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:3000/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ แก้ไขเรียบร้อย!');
      navigate('/seller-dashboard');
    } catch (err) {
      alert('❌ แก้ไขไม่สำเร็จ');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">✏️ แก้ไขสินค้า</h1>
        
        <div className="form-group">
          <label className="form-label">ชื่อสินค้า:</label>
          <input 
            type="text" 
            className="form-control"
            value={product.title}
            onChange={e => setProduct({...product, title: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">รายละเอียด:</label>
          <textarea 
            className="form-control"
            value={product.description}
            onChange={e => setProduct({...product, description: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">ราคา (บาท):</label>
          <input 
            type="number" 
            className="form-control"
            value={product.price}
            onChange={e => setProduct({...product, price: +e.target.value})}
            min="0"
          />
        </div>

        <button onClick={handleUpdate} className="btn-submit btn-submit-warning">
          💾 บันทึกการแก้ไข
        </button>
      </div>
    </div>
  );
}