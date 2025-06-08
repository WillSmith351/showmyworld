// src/modules/auth/auth.service.spec.ts
import { AuthService } from './auth.service';
import { HashService } from './config/hash.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { TokenService } from './config/token.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: {
    user: {
      create: jest.Mock;
    };
  };
  let hashService: Partial<Record<keyof HashService, jest.Mock>>;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let tokenService: Partial<Record<keyof TokenService, jest.Mock>>;

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
      },
    };

    hashService = {
      HashPassword: jest.fn(),
    };

    userService = {
      userByEmail: jest.fn(),
    };

    tokenService = {
      signToken: jest.fn(),
      verifiyToken: jest.fn(),
    };

    authService = new AuthService(
      prisma as any as PrismaService,
      hashService as HashService,
      userService as unknown as UserService,
      tokenService as unknown as TokenService,
    );
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

    it("devrait lancer BadRequestException si le user n'existe pas", async () => {
      (userService.userByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('notfound@email.com', 'anyPassword')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(authService.login('notfound@email.com', 'anyPassword')).rejects.toThrow(
        'User not found',
      );
      expect(userService.userByEmail).toHaveBeenCalledWith('notfound@email.com');
    });

    it('devrait lancer une erreur si le mot de passe est incorrect', async () => {
      const fakeUser = {
        id: 'user-id',
        email: 'user@email.com',
        username: 'user1',
        password: 'hashedPassword',
      };
      (userService.userByEmail as jest.Mock).mockResolvedValue(fakeUser);
      (hashService.comparePassword as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid password'));

      await expect(authService.login(fakeUser.email, 'wrongPassword')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(userService.userByEmail).toHaveBeenCalledWith(fakeUser.email.toLowerCase().trim());
      expect(hashService.comparePassword).toHaveBeenCalledWith('wrongPassword', fakeUser.password);
    });

    it('devrait retourner un token JWT si les identifiants sont valides', async () => {
      const fakeUser = {
        id: 'user-id',
        email: 'user@email.com',
        username: 'user1',
        password: 'hashedPassword',
      };
      (userService.userByEmail as jest.Mock).mockResolvedValue(fakeUser);
      (hashService.comparePassword as jest.Mock) = jest.fn().mockResolvedValue(true);
      (tokenService.signToken as jest.Mock).mockReturnValue('jwt-token');

      const result = await authService.login(fakeUser.email, 'correctPassword');

      expect(userService.userByEmail).toHaveBeenCalledWith(fakeUser.email.toLowerCase().trim());
      expect(hashService.comparePassword).toHaveBeenCalledWith(
        'correctPassword',
        fakeUser.password,
      );
      expect(tokenService.signToken).toHaveBeenCalledWith({
        userId: fakeUser.id,
        email: fakeUser.email,
        username: fakeUser.username,
      });
      expect(result).toBe('jwt-token');
    });
  });
});
