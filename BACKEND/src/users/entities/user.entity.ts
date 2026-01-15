import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'BUYER' }) // ค่าเริ่มต้นเป็น BUYER
  role: string; 

  // เพิ่ม 2 บรรทัดนี้สำหรับ Seller
  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;
}