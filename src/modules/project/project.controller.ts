import { Controller, Post, Body, UsePipes, ValidationPipe, UseFilters, Get } from '@nestjs/common';
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
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: TokenPayload) {
    return this.projectService.create(createProjectDto, user);
  }

  @Get()
  @UseFilters(PrismaExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  getAllProjects() {
    return this.projectService.getAllProjects();
  }
}
