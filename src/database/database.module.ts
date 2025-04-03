import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || '5432', 10), // Default to 5432 if undefined
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,  
            migrations: [],
            subscribers: [],
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
