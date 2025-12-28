GIU Food Truck Management System (Frontend)
Overview

The GIU Food Truck Management System is a web-based platform that allows customers to browse food trucks, view menus, place orders, and track their purchases, while enabling food truck owners to manage their menus and orders through a dedicated dashboard.

This repository focuses on the frontend application, which communicates with a RESTful backend API to handle authentication, data fetching, and real-time updates.

Frontend Features
Customer Features

User registration and login

Browse available food trucks

View truck menus by category

Add items to cart and manage quantities

Place orders and view order history

View detailed order information

Truck Owner Features

Owner registration and login

Owner dashboard overview

Manage menu items (add, edit, delete)

View incoming orders

Update order status (e.g., pending, preparing, completed)

Control truck availability

Tech Stack (Frontend)

HTML / CSS / JavaScript

Frontend framework (as implemented in the project)

REST API integration

Cookie-based or token-based authentication

Responsive UI design

Setup Instructions (Frontend)
1. Install Dependencies
npm install

2. Environment Configuration

Create a .env file in the root directory to connect the frontend with the backend API:

PORT=3000
NODE_ENV=development


Make sure the backend server is running and accessible.

3. Run the Frontend Application
npm run server


The application will be available at:

http://localhost:3000


Frontend Authentication Flow

Users register or log in through the UI

On successful login, the backend returns a JWT token

The token is stored automatically in cookies or used via Authorization headers

Protected pages and actions require authentication

UI elements and routes are displayed based on user role (Customer / Truck Owner)

API Integration Overview

The frontend communicates with the backend using REST APIs for:

Authentication

Register

Login

Get current user

Logout

Food Trucks

View all available trucks

View owner’s truck details

Update truck availability

Menu Items

View menus by truck

Filter menu items by category

CRUD operations for truck owners

Cart & Orders

Add, update, and remove cart items

Place orders

View order history and details

Update order status (truck owner)

User Flow (Frontend)
Customer Journey

Register / Login

Browse food trucks

View menu items

Add items to cart

Place an order

Track and view orders

Truck Owner Journey

Register / Login

Access owner dashboard

Manage menu items

View incoming orders

Update order statuses

Error Handling (UI)

Displays friendly error messages for failed requests

Handles common API errors:

Unauthorized access

Invalid input

Resource not found

Server errors

Notes

UI access is role-based (Customer vs Truck Owner)

Authentication is required for all protected pages

Sessions expire after 24 hours

Frontend dynamically updates based on API responses

Designed for scalability and maintainability