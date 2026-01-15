import { createContext, useContext, useState } from "react";

export type Role = "ADMIN" | "SELLER" | "BUYER" | "user";

export interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ เพิ่ม: โหลดค่าจาก localStorage ตอนเริ่มต้น เพื่อกัน Refresh แล้วหลุด
  const [user, setUser] = useState<User | null>(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (savedToken && savedRole) {
      // สร้าง User จำลองขึ้นมาก่อน เพื่อให้ App รู้ว่า Logged In แล้ว
      // (User จริงจะมาจากการ Login ใหม่ หรือถ้าจะให้ดีควรทำ API /me เพื่อดึงข้อมูลล่าสุด)
      return { 
        id: 0, // ID สมมติ
        username: 'User', // ชื่อสมมติ
        role: savedRole 
      };
    }
    return null;
  });

  const login = (userData: User, token: string) => {
    // ✅ ตรวจสอบป้องกัน Error
    if (!userData) {
      console.error("❌ Error: ไม่มีข้อมูล User ส่งมาที่ฟังก์ชัน login");
      return;
    }

    setUser(userData);
    localStorage.setItem('token', token);
    
    // ✅ จัดการ Role และบันทึกลง Storage
    const userRole = userData.role || 'user';
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // ลบรายการอื่นๆ ถ้ามี เช่น ตะกร้าสินค้า
    // localStorage.removeItem("cart"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};