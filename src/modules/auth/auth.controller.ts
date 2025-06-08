import { Controller, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SuccessMessage } from 'src/common/messages/success.message';
import { Public } from './config/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() signupDto: SignupDto) {
    const signup = await this.authService.signup(signupDto);
    return { message: SuccessMessage.SIGN_UP, data: { id: signup } };
  }

  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: LoginDto) {
    const login = await this.authService.login(loginDto.email, loginDto.password);
    return { message: SuccessMessage.LOGIN, data: { token: login } };
  }
}
