import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    // Monthly Sales Report
    async getMonthlySales(months: number = 6) {
        const date = new Date();
        date.setMonth(date.getMonth() - months);

        return this.orderRepo
            .createQueryBuilder('order')
            .select([
                "TO_CHAR(DATE_TRUNC('month', order.createdAt), 'YYYY-MM') AS month",
                'ROUND(SUM(order.totalAmount), 2) AS total_sales',
                'COUNT(order.id) AS order_count',
            ])
            .where('order.createdAt >= :date', { date })
            .groupBy('month')
            .orderBy('month', 'DESC')
            .getRawMany();
    }

    // Top Users
    async getTopUsers(limit: number = 10) {
        return this.userRepo
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.name',
                'COUNT(order.id) AS order_count',
                'ROUND(SUM(order.totalAmount), 2) AS total_spent',
            ])
            .leftJoin('user.orders', 'order')
            .groupBy('user.id')
            .orderBy('total_spent', 'DESC')
            .limit(limit)
            .getRawMany();
    }

    // Product Sales
    async getProductSales(limit: number = 10) {
        return this.productRepo
            .createQueryBuilder('product')
            .select([
                'product.id',
                'product.name',
                'SUM(orderItem.quantity) AS units_sold',
                'ROUND(SUM(orderItem.quantity * orderItem.price), 2) AS revenue',
            ])
            .innerJoin('product.orderItems', 'orderItem')
            .groupBy('product.id')
            .orderBy('revenue', 'DESC')
            .limit(limit)
            .getRawMany();
    }
}
