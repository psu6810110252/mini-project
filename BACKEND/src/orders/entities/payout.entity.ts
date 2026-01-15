import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../order.entity';

@Entity()
export class Payout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // จำนวนเงินที่จะโอนให้คนขาย

  @Column({ default: 'PENDING' })
  status: string; // PENDING, PAID

  @ManyToOne(() => User)
  seller: User; // ผู้ขายที่จะได้รับเงิน

  @ManyToOne(() => Order)
  order: Order; // อ้างอิงว่ามาจากออเดอร์ไหน

  @CreateDateColumn()
  createdAt: Date;
}