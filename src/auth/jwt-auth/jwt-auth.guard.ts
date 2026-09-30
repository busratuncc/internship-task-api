import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token bulunamadı');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token geçersiz veya süresi dolmuş');
    }
  }
}
