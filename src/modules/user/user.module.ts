import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, UserService],
})
export class UserModule {}
