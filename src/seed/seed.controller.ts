import { Controller, Post, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Post()
    @HttpCode(201)
    async seed() {
        return this.seedService.seedDatabase();
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async clear() {
        return this.seedService.clearDatabase();
    }
}
