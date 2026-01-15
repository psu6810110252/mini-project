import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// ✅ สำคัญ: Import CSS ตรงนี้
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ❌ ไม่ต้องใส่ AuthProvider, CartProvider หรือ BrowserRouter ตรงนี้ */}
    {/* เพราะใน App.tsx เราใส่ไว้ครบหมดแล้วครับ */}
    <App />
  </React.StrictMode>,
)