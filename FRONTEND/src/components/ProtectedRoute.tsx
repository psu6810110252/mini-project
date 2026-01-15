import React from 'react'; // ✅ 1. เพิ่มบรรทัดนี้
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode; // ✅ 2. แก้จาก JSX.Element เป็น React.ReactNode
  role?: 'admin' | 'seller';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth();

  // 1. ถ้ายังไม่ล็อกอิน -> ดีดไปหน้า Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. ถ้ามีการระบุ Role แต่ User ไม่ใช่ Role นั้น -> ดีดกลับหน้าแรก
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3. ผ่านด่านหมด -> อนุญาตให้เข้าหน้านั้นได้
  // ต้อง cast เป็น JSX.Element หรือ ReactElement เพื่อให้ return ได้ถูกต้องในบาง config
  return <>{children}</>; 
}