import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  // ✅ แก้ไขตรงนี้: เพิ่ม { onDelete: 'CASCADE' }
  // ความหมาย: เมื่อ Product ถูกลบ -> ให้ลบ OrderItem บรรทัดนี้ทิ้งด้วย
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;
}