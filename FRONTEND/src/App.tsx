import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // อย่าลืม import อันนี้ด้วยนะครับ เพื่อความปลอดภัย

// Pages
import Home from './pages/Home';      // ✅ หน้าแรก (Landing Page)
import Shop from './pages/Shop';      // ✅ หน้าร้านค้า (Shop)
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Navbar จะแสดงทุกหน้า */}
          <Navbar />

          <div className="container">
            <Routes>
              {/* 🏡 หน้าแรก (Landing Page) */}
              <Route path="/" element={<Home />} />

              {/* 🛍️ หน้าร้านค้า (รายการสินค้า) */}
              <Route path="/shop" element={<Shop />} />

              {/* 🔐 หน้า Login / Register */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🛒 หน้าตะกร้า & ประวัติ (ต้อง Login ก่อน) */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />

              {/* 👨‍💼 หน้าคนขาย (Seller Only) */}
              <Route path="/seller-dashboard" element={
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/add-product" element={
                <ProtectedRoute role="seller">
                  <AddProduct />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute role="seller">
                  <EditProduct />
                </ProtectedRoute>
              } />

              {/* 👮‍♂️ หน้าแอดมิน (Admin Only) */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />

            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}