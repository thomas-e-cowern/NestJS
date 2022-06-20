import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Generate the password
    const hash = await argon.hash(dto.password)
    // Save user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash
      },
      // select: {
      //   id: true,
      //   email: true,
      //   createdAt: true
      // }
      
    })
    delete user.hash
    // Return saved user
    return user;
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
