import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  signup(signupDto: SignupDto) {
    return signupDto;
  }
}
