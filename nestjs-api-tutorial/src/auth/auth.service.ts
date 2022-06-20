import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup(dto: AuthDto) {
    // Generate the password

    // Save user

    // Return saved user
    return { msg: 'I have signed up' };
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
