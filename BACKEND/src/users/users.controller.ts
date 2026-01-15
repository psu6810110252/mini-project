import { Controller, Get, Post, Body, Patch, UseGuards, Request } from '@nestjs/common'; // import เพิ่ม
import { AuthGuard } from '@nestjs/passport'; // import เพิ่ม
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() body: any) {
    return this.usersService.register(body);
  }

  // ✅ เพิ่ม: ดึงข้อมูลโปรไฟล์ตัวเอง (รวมเลขบัญชี)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  // ✅ เพิ่ม: อัปเดตเลขบัญชี
  @UseGuards(AuthGuard('jwt'))
  @Patch('bank-info')
  updateBank(@Request() req, @Body() body: { bankName: string; bankAccountNumber: string }) {
    return this.usersService.updateBankInfo(req.user.id, body.bankName, body.bankAccountNumber);
  }
}