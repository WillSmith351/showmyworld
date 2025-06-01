import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HashService } from './config/hash.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserService, HashService],
})
export class AuthModule {}
