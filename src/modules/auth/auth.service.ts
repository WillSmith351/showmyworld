import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, email } = signupDto;

    const existingUserByEmail = await this.userService.userByEmail(email);
    if (existingUserByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingUserByUsername = await this.userService.userByUsername(username);
    if (existingUserByUsername) {
      throw new BadRequestException('User with this username already exists');
    }

    return email;
  }
}
