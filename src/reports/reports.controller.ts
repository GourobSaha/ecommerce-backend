import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('monthly-sales')
    async getMonthlySales(
        @Query('months') months: number = 6
    ) {
        return this.reportsService.getMonthlySales(months);
    }

    @Get('top-users')
    async getTopUsers(
        @Query('limit') limit: number = 10
    ) {
        return this.reportsService.getTopUsers(limit);
    }

    @Get('product-performance')
    async getProductPerformance(
        @Query('limit') limit: number = 10
    ) {
        return this.reportsService.getProductSales(limit);
    }
}
