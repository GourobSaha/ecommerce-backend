import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedModule } from './seed/seed.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection
    DatabaseModule,

    // Feature modules
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReportsModule,

    // Seed module
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
