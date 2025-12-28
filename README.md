GIU Food Truck Management System
Project Description

The GIU Food Truck Management System is a full-stack web application designed to connect customers with food truck owners through a modern, user-friendly interface.
Customers can browse food trucks, view menus, place orders, and track their order history, while food truck owners can manage their menus, monitor incoming orders, and update order statuses.

This project demonstrates the implementation of role-based access control, RESTful API integration, and frontend–backend communication.

Features
Customer Features

User registration and login

Browse available food trucks

View food truck menus

Filter menu items by category

Add items to shopping cart

Edit or remove cart items

Place orders

View order history and order details

Truck Owner Features

Owner registration and login

Owner dashboard

Create, edit, and delete menu items

View all orders related to their truck

Update order status

Control truck availability

Technology Stack
Frontend

HTML

CSS

JavaScript

REST API integration

Backend

Node.js

Express.js

JWT Authentication

bcrypt (password hashing)

Database

PostgreSQL

pgAdmin4

ERD (Entity Relationship Diagram)
Entities and Tables

Users

userId (PK)

name

email

password

role

birthDate

Trucks

truckId (PK)

truckName

truckLogo

ownerId (FK → Users)

MenuItems

itemId (PK)

name

description

price

category

truckId (FK → Trucks)

Cart

cartId (PK)

userId (FK → Users)

itemId (FK → MenuItems)

quantity

Orders

orderId (PK)

userId (FK → Users)

truckId (FK → Trucks)

status

createdAt

OrderItems

orderItemId (PK)

orderId (FK → Orders)

itemId (FK → MenuItems)

quantity

price

Installation and Setup
1. Clone the Repository
git clone https://github.com/your-username/giu-food-truck-system.git
cd giu-food-truck-system

2. Install Dependencies
npm install

3. Database Setup

Open pgAdmin4

Create a PostgreSQL database

Open Query Tool

Run the SQL script located at:

connectors/script.sql

4. Environment Variables

Create a .env file in the root directory:

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
DB_PORT=5432
PORT=3000
NODE_ENV=development

5. Run the Application
npm run server


Access the application at:

http://localhost:3000

Test Credentials
Customer Account

Email: customer@test.com

Password: password123

Truck Owner Account

Email: owner@test.com

Password: password123

Screenshots
Authentication

Login Page

Register Page

Customer Interface

Customer Dashboard

Browse Food Trucks

Truck Menu

Shopping Cart

My Orders

Truck Owner Interface

Owner Dashboard

Menu Management

Add Menu Item

Order Management

(Screenshots are available in the screenshots/ folder)

API Endpoints Summary
Method	Endpoint	Description	Role
POST	/api/v1/auth/register	Register user	Public
POST	/api/v1/auth/login	Login user	Public
GET	/api/v1/auth/me	Get current user	Authenticated
POST	/api/v1/auth/logout	Logout	Authenticated
GET	/api/v1/trucks/view	View trucks	Customer
GET	/api/v1/menuItem/truck/:truckId	View truck menu	Customer
POST	/api/v1/cart/new	Add to cart	Customer
POST	/api/v1/order/new	Place order	Customer
GET	/api/v1/order/truckOrders	View orders	Truck Owner
PUT	/api/v1/order/updateStatus/:id	Update order	Truck Owner
Contributors
Name	Contribution
Ahmed abdelhalim	Frontend UI, API Integration, Authentication
ahmed yasser	Backend Development, Database Design
yaqeen	ERD, Testing, Documentation
Notes

Role-based access control is enforced

Passwords are encrypted using bcrypt

JWT tokens are used for authentication

Sessions expire after 24 hours

All protected routes require authentication