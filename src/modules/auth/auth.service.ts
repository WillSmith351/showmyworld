import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from './config/hash.service';
import { ErrorMessage } from '../../common/messages/error.message';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, firstname, lastname, email, password, jobTitle } = signupDto;

    const existingUserByEmail = await this.userService.userByEmail(email);
    if (existingUserByEmail) {
      throw new BadRequestException(ErrorMessage.USER.USER_EMAIL_ALREADY_EXIST);
    }

    const existingUserByUsername = await this.userService.userByUsername(username);
    if (existingUserByUsername) {
      throw new BadRequestException(ErrorMessage.USER.USER_USERNAME_ALREADY_EXIST);
    }

    const hashedPassword = await this.hashService.HashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        username,
        firstname,
        lastname,
        email,
        password: hashedPassword,
        jobTitle,
      },
    });
    return user.id;
  }
}
