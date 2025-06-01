import { Controller, Body, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const signup = await this.authService.signup(signupDto);
    return { message: 'signup success', data: { id: signup } };
  }
}
