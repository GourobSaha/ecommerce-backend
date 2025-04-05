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

# DATABSE_HOST at .env
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
