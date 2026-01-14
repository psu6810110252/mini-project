import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 1. import นี้
import { join } from 'path'; // 2. import นี้

async function bootstrap() {
  // 3. เพิ่ม <NestExpressApplication> ตรงนี้
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // 4. บรรทัดสำคัญ! บอกให้ Server ยอมให้คนเข้าถึงไฟล์ในโฟลเดอร์ uploads ได้
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap();