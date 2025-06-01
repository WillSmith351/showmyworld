import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async HashPassword(password: string): Promise<string> {
    try {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
      const salt = await bcrypt.genSalt(saltRounds);
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
