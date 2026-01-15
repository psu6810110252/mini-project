import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  // ✅ แก้ตรงนี้: ลบ parameter ตัวที่ 2 ออก และใส่ JoinColumn เพื่อความชัวร์
  @ManyToOne(() => User, { eager: true }) // eager: true ช่วยให้โหลดข้อมูล User มาอัตโนมัติเวลา query product
  user: User;
}