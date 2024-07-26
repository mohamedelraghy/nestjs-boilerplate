import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constant';
import { Request } from 'express';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractJwtFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log({ payload });
    return { userId: payload.sub, username: payload.username };
  }
}

export function extractJwtFromCookie(req: Request): string {
  console.log('jwt -> ', req?.session?.jwt || req?.cookies?.jwt || null);
  return req?.session?.jwt || req?.cookies?.jwt || null;
}
