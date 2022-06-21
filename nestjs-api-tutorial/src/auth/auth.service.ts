import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signup(dto: AuthDto) {
    // Generate the password
    const hash = await argon.hash(dto.password);
    // Save user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true
        // }
      });
      delete user.hash;
      // Return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    // If user doesn not exit, throw
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If password correct, throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    delete user.hash;
    // Return user
    return user;
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email
    }

    return this.jwt.signAsync()
  }
}
