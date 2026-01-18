import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // <--- 1. ต้อง Import อันนี้ไม่งั้น Auth พัง
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './upload.controller';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Payout } from './orders/entities/payout.entity';

@Module({
  imports: [
    // 2. ต้องใส่ ConfigModule ไว้บนสุด เพื่อให้อ่านไฟล์ .env (JWT_SECRET) ได้
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, // docker-compose เปิดพอร์ต 5432
      username: 'admin', // ใน docker-compose คือ admin
      password: 'password123', // ใน docker-compose คือ password123
      database: 'lecture_clubhouse_db', // ใน docker-compose คือ lecture_clubhouse_db
      entities: [User, Product, Order, OrderItem, Payout],
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [UploadController],
  providers: [],
})
export class AppModule { }