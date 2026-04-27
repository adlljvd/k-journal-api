import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: { email: string; password: string; name?: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new BadRequestException("Email already in use");

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const access_token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { user, access_token };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const access_token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      access_token,
    };
  }
}
