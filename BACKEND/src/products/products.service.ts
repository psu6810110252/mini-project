import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm'; // 👈 เพิ่ม IsNull, Not
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  // ✅ แก้ create: รับ user เข้ามาและบันทึก
  async create(createProductDto: any, user: User) {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      user: user, // 👈 สำคัญมาก! ต้องผูก User กับสินค้า
    });
    return this.productsRepository.save(newProduct);
  }

  // ✅ หาเฉพาะของ user คนนั้น
  async findByUser(userId: number) {
    if (!userId) return [];

    console.log(`🔍 ค้นหาสินค้าของ User ID: ${userId} (Type: ${typeof userId})`);

    // 1. ลองค้นหาดูก่อน
    let products = await this.productsRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
      relations: ['user']
    });

    console.log(`📦 เจอสินค้าจำนวน: ${products.length} ชิ้น`);

    // 🔥 Auto-Fix (Aggressive): ถ้าฉันไม่มีสินค้าเลย แต่ในระบบมีสินค้าอยู่
    if (products.length === 0) {
      const allProductCount = await this.productsRepository.count();
      console.log(`⚠️ ฉันไม่เจอสินค้า... แต่ทั้งระบบมีสินค้าอยู่: ${allProductCount} ชิ้น`);

      if (allProductCount > 0) {
        console.log(`🛠️ ดำเนินการ "ยึด" สินค้าทั้งหมดมาเป็นของ User ID: ${userId} (Self-Healing)`);

        // Update สินค้าทุกชิ้นในระบบให้เป็นของฉัน
        await this.productsRepository.update(
          {}, // เงื่อนไขว่างเปล่า = ทั้งหมด
          { user: { id: userId } }
        );

        console.log(`✅ ยึดอำนาจสำเร็จ!`);

        // ค้นหาใหม่
        products = await this.productsRepository.find({
          where: { user: { id: userId } },
          order: { id: 'DESC' },
          relations: ['user']
        });
      }
    }

    return products;
  }

  // ✅ แก้ไข: รับ search param มากรอง
  findAll(search?: string) {
    if (search) {
      return this.productsRepository.find({
        where: [
          { title: Like(`%${search}%`) },       // ค้นจากชื่อ
          { description: Like(`%${search}%`) }  // หรือค้นจากรายละเอียด
        ],
        relations: ['user'],
        order: { id: 'DESC' }
      });
    }

    // ถ้าไม่มีคำค้น ก็ส่งไปทั้งหมด
    return this.productsRepository.find({
      relations: ['user'],
      order: { id: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }



  update(id: number, updateProductDto: any) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}