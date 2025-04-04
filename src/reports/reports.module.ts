import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, User, Product]),
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule { }
