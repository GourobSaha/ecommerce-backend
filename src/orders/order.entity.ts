import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];
}
