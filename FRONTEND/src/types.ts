export interface User {
    id: number;
    username: string;
    role: string;
    bankName?: string;
    bankAccountNumber?: string;
}

export interface Product {
    id: number;
    title: string;
    description?: string;
    price: number;
    image: string;
    user?: User; // Owner
}

export interface OrderItem {
    id: number;
    quantity?: number;
    price: number;
    product?: Product;
}

export interface Order {
    id: number;
    status: string;
    totalPrice: number;
    slipImage?: string;
    createdAt: string;
    user?: User;
    orderItems?: OrderItem[];
    items?: OrderItem[]; // บาง API ส่งมาเป็น items
}

// สำหรับหน้า SellerDashboard ที่แสดงรายการขาย
export interface SoldItem {
    id: number;
    productName: string;
    price: number;
    fee: number;
    netPrice: number;
    orderId: number;
    createdAt: string;
    status: string;
}

// สำหรับหน้า AuthContext
export interface AuthResponse {
    access_token: string;
    user: User;
}
