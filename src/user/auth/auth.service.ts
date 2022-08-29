import { ConflictException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';

interface SignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { }

  async signup({ name, phone, email, password }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: UserType.BUYER,
      }
    });

    const token = jwt.sign({
      name,
      id: user.id,
    }, process.env.JSON_TOKEN_KEY, {
      expiresIn: 3600 * 24,
    });

    return token;
  }
}
