import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
  }

  async HashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hashed = await bcrypt.hash(password, salt);
      return hashed;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error hashing password',
        cause: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
