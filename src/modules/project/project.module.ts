import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, UserService],
})
export class ProjectModule {}
