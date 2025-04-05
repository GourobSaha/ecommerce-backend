import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async () => {
                const client = createClient({
                    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
                });
                await client.connect();
                return client;
            },
        },
        RedisService,
    ],
    exports: ['REDIS_CLIENT', RedisService], // Export both token and service
})
export class RedisModule { }
