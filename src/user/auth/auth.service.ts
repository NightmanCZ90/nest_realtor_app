import { BadRequestException, Injectable } from '@nestjs/common';
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

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { }

  async signup({ name, phone, email, password }: SignupParams, userType: UserType) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (userExists) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: userType,
      }
    });

    const token = this.generateJWT(name, user.id);

    return token;
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new BadRequestException('invalid credentials');
    }

    const token = this.generateJWT(user.name, user.id);

    return token;
  }

  private generateJWT(name: string, id: number) {
    return jwt.sign({
      name: name,
      id: id,
    }, process.env.JSON_TOKEN_KEY, {
      expiresIn: 3600 * 24,
    });
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.hash(string, 10);
  }
}
