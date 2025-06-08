import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectInvitationDto } from './dto/create-project-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
import { UserService } from '../user/user.service';
import { ErrorMessage } from 'src/common/messages/error.message';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user): Promise<Project> {
    const { title, description, userId, role, invitation } = createProjectDto;
    const projet = await this.prisma.project.create({
      data: {
        title,
        description,
        users: {
          create: {
            userId,
            role,
          },
        },
      },
    });

    console.log(user);

    if (invitation) {
      await Promise.all(
        invitation.map(async (user) => {
          await this.createProjectInvitation({
            username: user.username,
            projectId: projet.id,
            inviterId: userId,
            role: user.role,
          });
        }),
      );
    }

    return projet;
  }

  async createProjectInvitation(
    createProjectInvitationDto: CreateProjectInvitationDto,
  ): Promise<void> {
    const { username, projectId, inviterId, role } = createProjectInvitationDto;

    const user = await this.userService.userByUsername(username);

    if (!user) {
      throw new BadRequestException(ErrorMessage.USER.USER_NOT_FOUND);
    }

    if (user.id === inviterId) {
      throw new BadRequestException(ErrorMessage.PROJECT.PROJECT_INVITATION_USER_INVITED_SAME);
    }

    await this.prisma.projectInvitation.create({
      data: {
        projectId,
        inviteeId: user.id,
        inviterId,
        role,
      },
    });
  }

  async getAllProjects() {
    return await this.prisma.project.findMany({
      include: {
        users: {},
      },
    });
  }
}
