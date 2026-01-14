import { Injectable } from '@nestjs/common'; // ลบ UnauthorizedException ออกถ้าไม่ได้ใช้
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. ฟังก์ชันเช็ค User/Pass
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username); // เรียกใช้จาก UsersService
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

 async login(user: any) {
  const payload = { username: user.username, sub: user.id, role: user.role };
  
  return {
    access_token: this.jwtService.sign(payload),
    // 👇 เพิ่มบรรทัดนี้ เพื่อส่งข้อมูล User กลับไปให้ Frontend
    user: {
      id: user.id,
      username: user.username,
      role: user.role, 
    }
  };
}
}