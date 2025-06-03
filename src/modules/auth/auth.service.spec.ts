// src/modules/auth/auth.service.spec.ts
import { AuthService } from './auth.service';
import { HashService } from './config/hash.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: {
    user: {
      create: jest.Mock;
    };
  };
  let hashService: Partial<Record<keyof HashService, jest.Mock>>;

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
      },
    };

    hashService = {
      HashPassword: jest.fn(),
    };

    authService = new AuthService(prisma as any as PrismaService, hashService as HashService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signup', () => {
    const testSignupDto: SignupDto = {
      username: 'willSmith',
      firstname: 'Will',
      lastname: 'Smith',
      email: 'will.Smith@Gmail.com',
      password: 'PlainPassword123!',
      jobTitle: 'Frontend Developer',
    };

    it('devrait lancer BadRequestException si Prisma renvoie un P2002 sur le champ email', async () => {
      (hashService.HashPassword as jest.Mock).mockResolvedValue('hashedPassword123');

      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
      };
      prisma.user.create.mockRejectedValue(prismaError);

      await expect(authService.signup(testSignupDto)).rejects.toBeInstanceOf(BadRequestException);
      await expect(authService.signup(testSignupDto)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(hashService.HashPassword).toHaveBeenCalledWith(testSignupDto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: testSignupDto.username,
          firstname: testSignupDto.firstname,
          lastname: testSignupDto.lastname,
          email: testSignupDto.email.toLowerCase().trim(),
          password: 'hashedPassword123',
          jobTitle: testSignupDto.jobTitle,
        },
      });
    });

    it('devrait lancer BadRequestException si Prisma renvoie un P2002 sur le champ username', async () => {
      (hashService.HashPassword as jest.Mock).mockResolvedValue('hashedPassword123');

      const prismaError = {
        code: 'P2002',
        meta: { target: ['username'] },
      };
      prisma.user.create.mockRejectedValue(prismaError);

      await expect(authService.signup(testSignupDto)).rejects.toBeInstanceOf(BadRequestException);
      await expect(authService.signup(testSignupDto)).rejects.toThrow(
        'User with this username already exists',
      );

      expect(hashService.HashPassword).toHaveBeenCalledWith(testSignupDto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: testSignupDto.username,
          firstname: testSignupDto.firstname,
          lastname: testSignupDto.lastname,
          email: testSignupDto.email.toLowerCase().trim(),
          password: 'hashedPassword123',
          jobTitle: testSignupDto.jobTitle,
        },
      });
    });

    it('devrait renvoyer l’ID en cas de succès', async () => {
      (hashService.HashPassword as jest.Mock).mockResolvedValue('hashedPassword123');

      prisma.user.create.mockResolvedValue({
        id: 'generated-user-id',
        username: testSignupDto.username,
        firstname: testSignupDto.firstname,
        lastname: testSignupDto.lastname,
        email: testSignupDto.email.toLowerCase().trim(),
        password: 'hashedPassword123',
        jobTitle: testSignupDto.jobTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.signup(testSignupDto);

      expect(hashService.HashPassword).toHaveBeenCalledWith(testSignupDto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: testSignupDto.username,
          firstname: testSignupDto.firstname,
          lastname: testSignupDto.lastname,
          email: testSignupDto.email.toLowerCase().trim(),
          password: 'hashedPassword123',
          jobTitle: testSignupDto.jobTitle,
        },
      });
      expect(result).toBe('generated-user-id');
    });
  });
});
