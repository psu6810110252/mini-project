import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 1. import นี้
import { join } from 'path'; // 2. import นี้

async function bootstrap() {
  // 3. เพิ่ม <NestExpressApplication> ตรงนี้
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();





  await app.listen(3001);
}
bootstrap();