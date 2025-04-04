import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Product, Order, OrderItem]),
    ],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule { }
