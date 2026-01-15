import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- 1. ต้องมี
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // <--- 2. ต้องมี

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // <--- 3. บรรทัดนี้สำคัญที่สุด!
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}