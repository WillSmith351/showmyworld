// src/modules/auth/auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from './config/hash.service';
import { ErrorMessage } from '../../common/messages/error.message';
import { UserService } from '../user/user.service';
import { TokenService } from './config/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
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

  async login(email: string, password: string) {
    const user = await this.userService.userByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new BadRequestException(ErrorMessage.USER.USER_NOT_FOUND);
    }
    await this.hashService.comparePassword(password, user.password);

    const jwtToken = this.tokenService.signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return jwtToken;
  }
}
