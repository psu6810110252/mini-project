// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types'; // ✅ Import Type


export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false); // ✅ เพิ่มสถานะ Loading

  const { addToCart } = useCart();
  const { user } = useAuth();

  // ✅ 1. ยิง API หา Backend เมื่อพิมพ์ค้นหา (Server-Side Search)
  useEffect(() => {
    // เทคนิค Debounce: รอให้หยุดพิมพ์ 0.5 วิ ค่อยยิง API (ช่วยลดภาระ Server)
    const delaySearch = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]); // รันใหม่เมื่อคำค้นเปลี่ยน

  const fetchProducts = async (keyword: string) => {
    setLoading(true);
    try {
      // ✅ ส่ง Query Parameter ?search=... ไปหา Backend
      const res = await axios.get('http://localhost:3000/products', {
        params: { search: keyword }
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ รายการหมวดหมู่
  const categories = [
    { id: 'All', label: '🌟 ทั้งหมด' },
    { id: 'Math', label: '🧮 คณิตศาสตร์' },
    { id: 'Science', label: '🧪 วิทยาศาสตร์' },
    { id: 'English', label: '🅰️ ภาษาอังกฤษ' },
    { id: 'Thai', label: '🇹🇭 ภาษาไทย' },
    { id: 'Social', label: '🌍 สังคมศึกษา' },
  ];

  // ✅ 2. กรองหมวดหมู่ฝั่งหน้าบ้าน (Client-Side Filter)
  // (เอาผลลัพธ์จาก Backend มากรองตามปุ่มที่เลือกอีกที)
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'All') return true;

    const textToCheck = (p.title + (p.description || '')).toLowerCase();

    switch (selectedCategory) {
      case 'Math':
        return textToCheck.includes('คณิต') || textToCheck.includes('math') || textToCheck.includes('แคลคูลัส');
      case 'Science':
        return textToCheck.includes('วิทย์') || textToCheck.includes('sci') || textToCheck.includes('เคมี') || textToCheck.includes('ชีว') || textToCheck.includes('ฟิสิกส์');
      case 'English':
        return textToCheck.includes('อังกฤษ') || textToCheck.includes('eng') || textToCheck.includes('vocab');
      case 'Thai':
        return textToCheck.includes('ภาษาไทย') || textToCheck.includes('วรรณคดี');
      case 'Social':
        return textToCheck.includes('สังคม') || textToCheck.includes('ประวัติ') || textToCheck.includes('ภูมิศาสตร์');
      default:
        return true;
    }
  });

  return (
    <div className="container" style={{ marginTop: '30px' }}>

      {/* ช่องค้นหา */}
      <div style={{ maxWidth: '600px', margin: '0 auto 20px auto', position: 'relative' }}>
        <input
          type="text"
          placeholder="🔍 พิมพ์ชื่อวิชาเพื่อค้นหา..."
          className="form-control"
          style={{ padding: '15px 25px', borderRadius: '30px', fontSize: '1.1rem', textAlign: 'center' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {/* แสดง Loading เล็กๆ ให้รู้ว่ากำลังค้นหา */}
        {loading && <span style={{ position: 'absolute', right: '20px', top: '18px', color: '#888' }}>⏳</span>}
      </div>

      {/* ปุ่มหมวดหมู่ */}
      <div className="category-bar">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn-category ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid สินค้า */}
      <div className="product-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>⏳ กำลังโหลดข้อมูล...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={`http://localhost:3000/uploads/${product.image}`} alt={product.title} className="product-img" />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>{(product.description || '').substring(0, 100)}...</p>
                <div className="product-footer">
                  <span className="price">฿{product.price}</span>
                  {user?.role === 'seller' || user?.role === 'admin' ? (
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>(โหมดดูตัวอย่าง)</span>
                  ) : (
                    <button onClick={() => addToCart(product)} className="btn-add">
                      🛒 ใส่ตะกร้า
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
            <h3>❌ ไม่พบวิชา "{searchTerm}" ในหมวดหมู่นี้</h3>
            <p>ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่ "ทั้งหมด" ดูนะครับ</p>
          </div>
        )}
      </div>
    </div>
  );
}