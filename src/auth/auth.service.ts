import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.usersRepo.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name']
            });

            if (!user) {
                this.logger.warn(`Login attempt for non-existent user: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                this.logger.warn(`Invalid password for user: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            return user;
        } catch (error) {
            this.logger.error(`Authentication error: ${error.message}`, error.stack);
            throw error;
        }
    }

    async login(user: User) {
        try {
            const payload = {
                sub: user.id,
                email: user.email,
                name: user.name
            };

            const accessToken = this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_EXPIRATION || '1h'
            });

            // Store session in Redis with TTL matching token expiration
            await this.redisService.set(
                `user:${user.id}:session`,
                accessToken,
                parseInt(process.env.JWT_EXPIRATION || '3600')
            );

            return {
                access_token: accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        } catch (error) {
            this.logger.error(`Login error for user ${user.id}`, error.stack);
            throw new UnauthorizedException('Login failed');
        }
    }

    async logout(userId: number): Promise<void> {
        try {
            await this.redisService.del(`user:${userId}:session`);
            this.logger.log(`User ${userId} logged out successfully`);
        } catch (error) {
            this.logger.error(`Logout error for user ${userId}`, error.stack);
            throw new UnauthorizedException('Logout failed');
        }
    }

    async validateToken(token: string): Promise<{ isValid: boolean; payload?: any }> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET
            });

            const storedToken = await this.redisService.get(`user:${payload.sub}:session`);

            return {
                isValid: storedToken === token,
                payload: storedToken ? payload : null
            };
        } catch (error) {
            this.logger.warn(`Token validation failed: ${error.message}`);
            return { isValid: false };
        }
    }

    async refreshSession(userId: number): Promise<string> {
        try {
            const user = await this.usersRepo.findOne({ where: { id: userId } });
            if (!user) throw new UnauthorizedException('User not found');

            const newToken = this.jwtService.sign(
                { sub: user.id, email: user.email },
                { expiresIn: process.env.JWT_EXPIRATION || '1h' }
            );

            await this.redisService.set(
                `user:${user.id}:session`,
                newToken,
                parseInt(process.env.JWT_EXPIRATION || '3600')
            );

            return newToken;
        } catch (error) {
            this.logger.error(`Session refresh failed for user ${userId}`, error.stack);
            throw new UnauthorizedException('Session refresh failed');
        }
    }
}
