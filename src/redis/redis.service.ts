import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: RedisClientType;

    async onModuleInit() {
        try {
            this.client = createClient({
                url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
                socket: {
                    connectTimeout: 5000,
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            this.logger.error('Failed to connect to Redis after 5 retries');
                            throw new Error('Redis connection failed');
                        }
                        this.logger.warn(`Retrying Redis connection (attempt ${retries + 1})`);
                        return 1000; // Reconnect after 1 second
                    }
                }
            });

            this.client.on('error', (err) => this.logger.error('Redis error', err));
            this.client.on('connect', () => this.logger.log('Redis connected'));
            this.client.on('reconnecting', () => this.logger.warn('Redis reconnecting'));
            this.client.on('ready', () => this.logger.log('Redis ready'));

            await this.client.connect();
        } catch (err) {
            this.logger.error('Redis connection failed', err.stack);
            throw err;
        }
    }

    // async onModuleInit() {
    //     this.client = createClient({
    //         socket: {
    //             host: 'ecommerce-redis', // Matches container_name
    //             port: 6379,
    //             connectTimeout: 5000
    //         }
    //     });

    //     this.client.on('error', (err) =>
    //         console.error('Redis Client Error', err));

    //     await this.client.connect();
    //     console.log('Redis connection established');
    // }
    
    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await this.client.setEx(key, ttl, serialized);
            } else {
                await this.client.set(key, serialized);
            }
        } catch (err) {
            this.logger.error(`Redis SET error for key ${key}`, err);
            throw err;
        }
    }

    async get<T = any>(key: string): Promise<T | null> {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            this.logger.error(`Redis GET error for key ${key}`, err);
            throw err;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (err) {
            this.logger.error(`Redis DEL error for key ${key}`, err);
            throw err;
        }
    }

    async keys(pattern: string): Promise<string[]> {
        try {
            return await this.client.keys(pattern);
        } catch (err) {
            this.logger.error(`Redis KEYS error for pattern ${pattern}`, err);
            throw err;
        }
    }

    async ping(): Promise<string> {
        try {
            return await this.client.ping();
        } catch (err) {
            this.logger.error('Redis PING error', err);
            throw err;
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            return (await this.ping()) === 'PONG';
        } catch {
            return false;
        }
    }
}