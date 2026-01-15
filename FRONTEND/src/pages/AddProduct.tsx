import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ ลงขายเรียบร้อย!');
      navigate('/seller-dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">✨ ลงขาย Lecture ใหม่</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ชื่อวิชา / หัวข้อ:</label>
            <input 
              type="text" 
              className="form-control"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="เช่น สรุปเคมี ม.ปลาย, แคลคูลัส 1 (บทที่ 1-3)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">รายละเอียด:</label>
            <textarea 
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="อธิบายเกี่ยวกับ Lecture ของคุณ..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">ราคา (บาท):</label>
            <input 
              type="number" 
              className="form-control"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              min="0"
              placeholder="เช่น 159"
            />
          </div>

          <div className="form-group">
            <label className="form-label">รูปปก Lecture:</label>
            {/* ซ่อน input file ของจริงไว้ แล้วสร้าง UI สวยๆ มาครอบ */}
            <div className="file-upload-container" onClick={() => document.getElementById('fileInput')?.click()}>
              <span style={{ fontSize: '3rem' }}>📁</span>
              <label htmlFor="fileInput" className="file-upload-label">
                {file ? `✅ เลือกไฟล์แล้ว: ${file.name}` : 'คลิกเพื่อเลือกรูปภาพ'}
              </label>
              <input 
                id="fileInput"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }} // ซ่อน input ของจริง
              />
            </div>
          </div>

          <button type="submit" className="btn-submit btn-submit-primary">
            + ยืนยันการลงขาย
          </button>
        </form>
      </div>
    </div>
  );
}