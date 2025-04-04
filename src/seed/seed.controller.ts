import { Controller, Post, Delete, HttpCode } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Post()
    @HttpCode(201)
    async seed() {
        return this.seedService.seedDatabase();
    }

    @Delete()
    async clear() {
        return this.seedService.clearDatabase();
    }
}
