import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 👈 1. Import

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) { // 👈 2. Inject ConfigService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'LectureSecretKey2026', // ✅ 3. ใช้ค่าเดียวกับ AuthModule เป๊ะ
    });
  }

  async validate(payload: any) {
    // เมื่อแกะบัตรผ่าน จะส่งข้อมูลนี้ไปให้ Controller ใช้งาน (ผ่านตัวแปร req.user)
    // สำคัญ: ต้องส่ง key ชื่อ 'id' เพื่อให้ตรงกับ Database
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}