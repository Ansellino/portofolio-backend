import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      throw new UnauthorizedException('Invalid credentials');
    return admin;
  }

  async login(admin: any) {
    const payload = { sub: admin.id, email: admin.email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRY') || '15m',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRY') || '7d',
    });
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });
    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, rt: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: userId } });
    if (!admin?.refreshToken) throw new UnauthorizedException();
    if (!(await bcrypt.compare(rt, admin.refreshToken)))
      throw new UnauthorizedException();
    return this.login(admin);
  }

  async refreshTokensByToken(rt: string) {
    let payload: { sub: string; email: string };

    try {
      payload = this.jwt.verify(rt, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.refreshTokens(payload.sub, rt);
  }

  async logout(userId: string) {
    await this.prisma.admin.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
