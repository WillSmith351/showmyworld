import {
  Controller,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseFilters,
  Get,
} from '@nestjs/common';
import { PrismaExceptionFilter } from '../../common/filters/prisma-exception.filter';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { CurrentUser } from '../auth/config/current-user.decorator';
import { TokenPayload } from '../auth/config/token.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseFilters(PrismaExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: TokenPayload) {
    return await this.projectService.create(createProjectDto, user);
  }

  @Get()
  @UseFilters(PrismaExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getAllProjects() {
    return await this.projectService.getAllProjects();
  }

  @Get(':id')
  @UseFilters(PrismaExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getProjectById(@Param('id') id: string) {
    return await this.projectService.getProjectById(id);
  }

  @Get(':id/invitation')
  @UseFilters(PrismaExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getProjectInvitation(@Param('id') id: string) {
    return await this.projectService.getInvitationsByProjectId(id);
  }
}
