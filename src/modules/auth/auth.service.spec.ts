import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HashService } from './config/hash.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let hashService: Partial<Record<keyof HashService, jest.Mock>>;
  let prisma: {
    user: {
      create: jest.Mock;
    };
  };

  beforeEach(() => {
    userService = {
      userByEmail: jest.fn(),
      userByUsername: jest.fn(),
    };

    prisma = {
      user: {
        create: jest.fn(),
      },
    };

    hashService = {
      HashPassword: jest.fn(),
    };

    authService = new AuthService(
      userService as any as UserService,
      prisma as any as PrismaService,
      hashService as HashService,
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
      email: 'will.smith@gmail.com',
      password: 'hashedPassword',
      jobTitle: 'Frontend Developer',
    };

    it('should throw BadRequestException if user with email already exists', async () => {
      (userService.userByEmail as jest.Mock).mockResolvedValue({
        id: 'existingUserId',
        email: testSignupDto.email,
      });

      await expect(authService.signup(testSignupDto)).rejects.toBeInstanceOf(BadRequestException);
      expect(userService.userByEmail).toHaveBeenCalledWith(testSignupDto.email);
      expect(hashService.HashPassword).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if user with username already exists', async () => {
      (userService.userByUsername as jest.Mock).mockResolvedValue({
        id: 'existingUserId',
        username: testSignupDto.username,
      });

      await expect(authService.signup(testSignupDto)).rejects.toBeInstanceOf(BadRequestException);
      expect(userService.userByEmail).toHaveBeenCalledWith(testSignupDto.email);
      expect(userService.userByUsername).toHaveBeenCalledWith(testSignupDto.username);
      expect(hashService.HashPassword).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should create a new user and return the user Id', async () => {
      (userService.userByEmail as jest.Mock).mockResolvedValue(null);
      (userService.userByUsername as jest.Mock).mockResolvedValue(null);
      (hashService.HashPassword as jest.Mock).mockResolvedValue(testSignupDto.password);
      prisma.user.create.mockResolvedValue({ id: 'new-generated-id' });

      const result = await authService.signup(testSignupDto);
      const expectUser = {
        id: 'new-generated-id',
        username: testSignupDto.username,
        firstname: testSignupDto.firstname,
        lastname: testSignupDto.lastname,
        email: testSignupDto.email,
        password: testSignupDto.password,
        jobTitle: testSignupDto.jobTitle,
      };

      expect(userService.userByEmail).toHaveBeenCalledWith(testSignupDto.email);
      expect(userService.userByUsername).toHaveBeenCalledWith(testSignupDto.username);
      expect(hashService.HashPassword).toHaveBeenCalledWith(testSignupDto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: testSignupDto.username,
          firstname: testSignupDto.firstname,
          lastname: testSignupDto.lastname,
          email: testSignupDto.email,
          password: testSignupDto.password,
          jobTitle: testSignupDto.jobTitle,
        },
      });
      expect(result).toBe(expectUser.id);
    });
  });
});
