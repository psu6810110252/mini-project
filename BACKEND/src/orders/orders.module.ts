import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity'; // 👈 แก้ตรงนี้: ตัด /entities ออก
import { OrderItem } from './order-item.entity'; // 👈 แก้ตรงนี้: ตัด /entities ออก
import { Product } from '../products/entities/product.entity';
import { Payout } from './entities/payout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Payout]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}