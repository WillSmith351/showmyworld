// src/modules/auth/auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from './config/hash.service';
import { ErrorMessage } from '../../common/messages/error.message';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async signup(signupDto: SignupDto): Promise<string> {
    const { username, firstname, lastname, email, password, jobTitle } = signupDto;
    const hashedPassword = await this.hashService.HashPassword(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          firstname,
          lastname,
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          jobTitle,
        },
      });
      return user.id;
    } catch (error: unknown) {
      const err = error as { code?: string; meta?: { target?: string[] } };
      if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
        const targetFields = err.meta?.target || [];
        const conflictField = targetFields.length ? targetFields[0] : 'unknown';

        if (conflictField === 'email') {
          throw new BadRequestException(ErrorMessage.USER.USER_EMAIL_ALREADY_EXIST);
        }
        if (conflictField === 'username') {
          throw new BadRequestException(ErrorMessage.USER.USER_USERNAME_ALREADY_EXIST);
        }
      }
      throw new BadRequestException(ErrorMessage.PRISMA.UNEXPECTED_ERROR);
    }
  }
}
