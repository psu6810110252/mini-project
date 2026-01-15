import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- เพิ่ม
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // <--- เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <--- เพิ่มบรรทัดนี้ เพื่อให้ AuthModule เรียกใช้ได้
})
export class UsersModule {}