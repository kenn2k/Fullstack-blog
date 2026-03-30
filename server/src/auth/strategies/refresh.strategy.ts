import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginUser } from '../types';
import { COOKIE, STRATEGY } from '../constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.JWT_REFRESH,
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField(COOKIE.REFRESH_TOKEN),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: LoginUser) {
    const refreshToken = (req.body as Record<string, string>)?.refresh_token;
    return { ...payload, refreshToken };
  }
}
