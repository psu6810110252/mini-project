import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // ✅ 1. สั่งซื้อแบบชิ้นเดียว
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `slip-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Request() req, @Body('productId') productId: any, @UploadedFile() file: Express.Multer.File) {
    const slipFileName = file ? file.filename : undefined;
    if (productId) {
      return this.ordersService.create(req.user.id, +productId, slipFileName);
    }
    return { message: "Invalid Request: productId is missing" };
  }

  // ✅ 2. สั่งซื้อแบบตะกร้า (Bulk)
  @UseGuards(AuthGuard('jwt'))
  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `slip-bulk-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async createBulk(@Request() req, @Body('items') itemsString: string, @UploadedFile() file: Express.Multer.File) {
    let items = [];
    try {
      items = JSON.parse(itemsString);
    } catch (e) {
      console.error("Parse Error:", e);
    }

    const slipFileName = file ? file.filename : undefined;
    return this.ordersService.createBulk(req.user.id, items, slipFileName);
  }

  // ✅ 3. ดูประวัติการสั่งซื้อ (ของตัวเอง)
  @UseGuards(AuthGuard('jwt'))
  @Get('my-orders')
  findMyOrders(@Request() req) {
    return this.ordersService.findAll(req.user.id);
  }

  // ✅ 4. ดูยอดขาย/รายได้ (Income) <--- ต้องเพิ่มตรงนี้ครับ!
  @UseGuards(AuthGuard('jwt'))
  @Get('income')
  async getIncome(@Request() req) {
    return this.ordersService.getMyIncome(req.user.id);
  }

  // ✅ 5. ดูรายการโอนเงิน (Payouts)
  @UseGuards(AuthGuard('jwt'))
  @Get('payouts/my')
  async getMyPayouts(@Request() req) {
    return this.ordersService.getMyPayouts(req.user.id);
  }

  // ✅ 5.5 ดูรายได้ Admin (Admin Dashboard)
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/revenue')
  getAdminRevenue() {
    return this.ordersService.getAdminRevenue();
  }

  // ✅ 6. ดูออเดอร์ทั้งหมด (Admin - แบบเจาะจง Route)
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all')
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  // ✅ 7. อนุมัติ/เปลี่ยนสถานะออเดอร์ (Admin)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    if (status === 'PAID') {
      return this.ordersService.approve(+id);
    }
    return this.ordersService.updateStatus(+id, status);
  }

  // ✅ 8. ดึงออเดอร์ทั้งหมด (Admin Dashboard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

}