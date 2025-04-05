# 🛍️ E-Commerce Backend System

A scalable NestJS backend for e-commerce applications featuring JWT authentication, Redis session management, and PostgreSQL data storage.

## 🚀 Features

- **JWT Authentication** with Redis session storage  
- **Dockerized** services (NestJS + PostgreSQL + Redis)  
- **TypeORM** for database operations  
- **Reports**:
  - Monthly sales analytics  
  - User purchase history  
  - Product performance metrics  

## 📦 Prerequisites

- Docker 20.10+  
- Docker Compose 2.0+  
- Node.js 18+  

## 🛠️ Setup

```bash
# Clone the repository
git clone https://github.com/GourobSaha/ecommerce-backend.git
cd ecommerce-backend

# Configure environment
cp .env.example .env
nano .env  # Edit with your credentials

# Start services
docker-compose up -d --build

# DATABASE_HOST at .env
docker inspect ecommerce-backend-db-1 | grep "IPAddress"

# REDIS_HOST at .env
docker inspect ecommerce-backend-redis-1 | grep "IPAddress"

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## 🌐 Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

# 🔮 APIs
## 🌱 Seed 

**Seed Data**

- 5 users.
- 10 products.
- Each user has 5 orders, with dates randomly spread across the last 6 months.
- Each order contains 2-4 products with random quantities.

POST: `http://localhost:8080/seed`

Response: 
```
{
    "message": "Database seeded successfully",
    "data": {
        "users": 5,
        "products": 10,
        "orders": 25
    }
}
```

**Clear Data**

DELETE: `http://localhost:8080/seed`

Authentication: `Bearer Token`

Response: 
```
{
    "message": "Database cleared successfully"
}
```

## 🙅🏻 Auth
**Login**

POST: `http://localhost:8080/auth/login`

Body: 
```
{
    "email": "user1@example.com",
    "password": "password1"
}
```
Response: 
```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwibmFtZSI6IlVzZXIgMSIsImlhdCI6MTc0Mzg1NDUwMSwiZXhwIjoxNzQzODU4MTAxfQ.bylaSeW9Kkwn6h4MP2lCB-EI9gXi-qA9x6_KFZGrHRA",
    "user": {
        "id": 11,
        "email": "user1@example.com",
        "name": "User 1"
    }
}
```

**Logout**

POST: `http://localhost:8080/auth/`

Auth: `Bearer Token`

Response: 
```
{
    "message": "Logged out successfully"
}
```
## 📊 Reports
**Monthly Sales**

GET: `http://localhost:8080/reports/monthly-sales`

Response: 
```
[
    {
        "month": "2025-04",
        "total_sales": "145.00",
        "order_count": "1"
    },
    {
        "month": "2025-02",
        "total_sales": "955.00",
        "order_count": "6"
    },
    {
        "month": "2025-01",
        "total_sales": "1140.00",
        "order_count": "8"
    },
    {
        "month": "2024-12",
        "total_sales": "415.00",
        "order_count": "2"
    },
    {
        "month": "2024-11",
        "total_sales": "830.00",
        "order_count": "5"
    },
    {
        "month": "2024-10",
        "total_sales": "555.00",
        "order_count": "3"
    }
]
```

**Top Users**

GET: `http://localhost:8080/reports/top-users`

Response: 
```
[
    {
        "user_id": 14,
        "user_name": "User 2",
        "order_count": "5",
        "total_spent": "865.00"
    },
    {
        "user_id": 12,
        "user_name": "User 4",
        "order_count": "5",
        "total_spent": "840.00"
    },
    {
        "user_id": 11,
        "user_name": "User 1",
        "order_count": "5",
        "total_spent": "810.00"
    },
    {
        "user_id": 13,
        "user_name": "User 3",
        "order_count": "5",
        "total_spent": "800.00"
    },
    {
        "user_id": 15,
        "user_name": "User 5",
        "order_count": "5",
        "total_spent": "725.00"
    }
]
```

**Product Performance**

GET: `http://localhost:8080/reports/product-performance`

Response: 
```
[
    {
        "product_id": 16,
        "product_name": "Product F",
        "units_sold": "22",
        "revenue": "770.00"
    },
    {
        "product_id": 17,
        "product_name": "Product H",
        "units_sold": "13",
        "revenue": "585.00"
    },
    {
        "product_id": 19,
        "product_name": "Product I",
        "units_sold": "10",
        "revenue": "500.00"
    },
    {
        "product_id": 20,
        "product_name": "Product J",
        "units_sold": "8",
        "revenue": "440.00"
    },
    {
        "product_id": 15,
        "product_name": "Product D",
        "units_sold": "14",
        "revenue": "350.00"
    },
    {
        "product_id": 14,
        "product_name": "Product E",
        "units_sold": "11",
        "revenue": "330.00"
    },
    {
        "product_id": 18,
        "product_name": "Product G",
        "units_sold": "8",
        "revenue": "320.00"
    },
    {
        "product_id": 13,
        "product_name": "Product C",
        "units_sold": "15",
        "revenue": "300.00"
    },
    {
        "product_id": 11,
        "product_name": "Product A",
        "units_sold": "25",
        "revenue": "250.00"
    },
    {
        "product_id": 12,
        "product_name": "Product B",
        "units_sold": "13",
        "revenue": "195.00"
    }
]
```


