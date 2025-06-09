import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessage } from '../../../common/messages/error.message';

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

@Injectable()
export class TokenService {
  private readonly jwtExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '1week';
  }

  signToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }

  verifiyToken(token: string): TokenPayload {
    try {
      const decoded = this.jwtService.verify<TokenPayload>(token);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException(
        ErrorMessage.AUTH.INVALID_TOKEN,
        err instanceof Error ? err.message : String(err),
      );
    }
  }
}
