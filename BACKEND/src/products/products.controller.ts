import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // ✅ แก้ไข 1: เปลี่ยนมาใช้ฟังก์ชัน findByUser ที่เราเพิ่มใน Service
  // วิธีนี้จะค้นหาจาก Database โดยตรง แม่นยำกว่าการ filter เอง
  @UseGuards(AuthGuard('jwt'))
  @Get('my-products')
  findMyProducts(@Request() req) {
    return this.productsService.findByUser(req.user.id);
  }

  @Get()
  findAll(@Query('search') search: string) {
    return this.productsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // 📸 รับไฟล์รูปภาพ
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(@Body() createProductDto: any, @Request() req: any, @UploadedFile() file: Express.Multer.File) {
    // แปลงค่า price เป็นตัวเลข
    if (createProductDto.price) {
      createProductDto.price = Number(createProductDto.price);
    }

    // ถ้ามีไฟล์แนบมา ให้เอาชื่อไฟล์ใส่ลงไปในข้อมูลด้วย
    if (file) {
      createProductDto.image = file.filename;
    }

    // ส่ง req.user ไปให้ service เพื่อบันทึกคนขาย
    return this.productsService.create(createProductDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    if (updateProductDto.price) {
      updateProductDto.price = Number(updateProductDto.price);
    }
    return this.productsService.update(+id, updateProductDto);
  }
}