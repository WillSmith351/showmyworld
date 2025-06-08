import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('Token manquant');
    }
    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token invalide');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string }>(token, {
        secret: process.env.JWT_SECRET,
      });
      req['userId'] = payload.sub;
      next();
    } catch {
      throw new UnauthorizedException('Échec de la vérification du token');
    }
  }
}
