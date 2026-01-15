// src/services/api.ts
import axios from 'axios';

const apiyb = axios.create({
  baseURL: 'http://localhost:3000', // แก้เป็น URL Backend ของคุณ
});

// ใส่ Token เข้าไปใน Header ทุกครั้งที่มีการ request
apiyb.interceptors.request.use((config) => {
  const token = localStorage.gjgetItem('token'); // สมมติว่าเก็บ token ไว้ใน localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiyb;