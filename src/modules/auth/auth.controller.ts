import { Controller, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SuccessMessage } from 'src/common/messages/success.message';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() signupDto: SignupDto) {
    const signup = await this.authService.signup(signupDto);
    return { message: SuccessMessage.SIGN_UP, data: { id: signup } };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: LoginDto) {
    const login = await this.authService.login(loginDto.email, loginDto.password);
    return { message: SuccessMessage.LOGIN, data: { token: login } };
  }
}
