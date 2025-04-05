import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private redisService: RedisService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const isValid = await this.redisService.get(`user:${payload.sub}:session`);

        if (!isValid || isValid !== token) {
            throw new UnauthorizedException('Invalid or expired session');
        }

        return { userId: payload.sub, email: payload.email };
    }
}
