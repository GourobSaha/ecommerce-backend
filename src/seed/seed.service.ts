import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

    async seedDatabase() {
        console.log('Seeding started...');

        // 1. Seed Users
        const userData = [
            { name: 'User 1', email: 'user1@example.com', password: 'password1' },
            { name: 'User 2', email: 'user2@example.com', password: 'password2' },
            { name: 'User 3', email: 'user3@example.com', password: 'password3' },
            { name: 'User 4', email: 'user4@example.com', password: 'password4' },
            { name: 'User 5', email: 'user5@example.com', password: 'password5' },
        ];

        const users = await Promise.all(
            userData.map(async (user) => {
                const newUser = this.userRepository.create({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                });
                return this.userRepository.save(newUser);
            }
            )
        );

        console.log(`${users.length} users seeded`);

        // 2. Seed Products
        const productData = [
            { name: 'Product A', price: 10 },
            { name: 'Product B', price: 15 },
            { name: 'Product C', price: 20 },
            { name: 'Product D', price: 25 },
            { name: 'Product E', price: 30 },
            { name: 'Product F', price: 35 },
            { name: 'Product G', price: 40 },
            { name: 'Product H', price: 45 },
            { name: 'Product I', price: 50 },
            { name: 'Product J', price: 55 },
        ];

        const products = await Promise.all(
            productData.map(async (product) => {
                const newProduct = this.productRepository.create(product);
                return this.productRepository.save(newProduct);
            })
        );
        console.log(`${products.length} products seeded`);

        // 3. Seed Orders
        const orders: Order[] = [];
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        for (const user of users) {
            for (let i = 0; i < 5; i++) {
                // Random date in the last 6 months
                const randomDate = new Date(
                    sixMonthsAgo.getTime() +
                    Math.random() * (new Date().getTime() - sixMonthsAgo.getTime())
                );

                const order = this.orderRepository.create({
                    user,
                    createdAt: randomDate,
                    totalAmount: 0,
                });
                orders.push(await this.orderRepository.save(order));
            }
        }
        console.log(`${orders.length} orders seeded`);

        for (const order of orders) {
            const numProducts = Math.floor(Math.random() * 3) + 2;
            const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffledProducts.slice(0, numProducts);

            let orderTotal = 0;

            for (const product of selectedProducts) {
                const quantity = Math.floor(Math.random() * 3) + 1;
                const price = product.price * quantity;

                const orderItem = this.orderItemRepository.create({
                    order,
                    product,
                    quantity,
                    price: product.price, // Store unit price
                });
                await this.orderItemRepository.save(orderItem);

                orderTotal += price;
            }

            order.totalAmount = orderTotal;
            await this.orderRepository.save(order);
        }
        console.log('Order items seeded and order totals updated');

        console.log('Seeding completed successfully!');
        return {
            users: users.length,
            products: products.length,
            orders: orders.length,
        };
    }

    async clearDatabase() {
        await this.orderItemRepository.delete({});
        await this.orderRepository.delete({});
        await this.productRepository.delete({});
        await this.userRepository.delete({});
        console.log('Database cleared');
    }
}
