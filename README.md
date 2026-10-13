Verdant --- Full-Stack E-Commerce Website (Task 4)

Brand: Verdant --- Everyday, Elevated
Frontend: React + TypeScript + Vite
Backend: Node.js + Express + TypeScript
Database: PostgreSQL
Authentication: bcrypt password hashing + JWT
Deployment: Vercel

Verdant is a full-stack e-commerce web application built with separate
frontend and backend folders. The frontend provides the shopping
experience, while the backend exposes REST API endpoints and persists
user, product, and order data in PostgreSQL.

Live Demo

Frontend: https://e-commerce-platform-pied.vercel.app/

Backend API: Replace this with the actual deployed backend URL.

GitHub repository:
https://github.com/ravindi5387/E-Commerce-Platform

The frontend URL above is the one supplied for this project. Make sure
the backend link points to the separate backend deployment, not the
frontend domain.

Screenshots

Place real screenshots from your deployed website in the screenshots/
folder using these exact filenames. The images will appear in this
README after you commit and push them.

Home page

Product catalogue, search and filters

Product details

Shopping cart

Registration

Login

Checkout or order confirmation

Customer order history

Optional: database evidence

Included Features

Frontend

Responsive, light sage-green and cream design

Product catalogue, search, category filters, and sorting

Product detail modal

Wishlist and cart quantity controls

Registration and sign-in interface

Checkout form that submits orders to the backend (no card
payments)

Customer order history

Newsletter form validation

Backend

Product listing, searching, filtering, sorting, and product details

Registration and login

bcrypt password hashing and JWT authentication

Authenticated order creation using a database transaction

Stock validation and stock updates

Customer order history

Admin-only product creation and all-orders listing

Input validation with Zod and parameterized SQL

Technology Stack

Frontend: React, TypeScript, Vite, CSS

Backend: Node.js, Express, TypeScript

Authentication/security: bcrypt, JWT, Zod validation,
parameterized SQL

Database: PostgreSQL

Deployment: Vercel

Version control: Git and GitHub

Project Structure

E-Commerce-Platform/
├── frontend/
│ ├── src/
│ ├── index.html
│ ├── package.json
│ ├── tsconfig.json
│ ├── tsconfig.app.json
│ ├── vite.config.ts
│ └── .env.example
├── backend/
│ ├── src/
│ ├── database/
│ │ └── schema.sql
│ ├── package.json
│ ├── tsconfig.json
│ └── .env.example
├── screenshots/
├── README.md
└── .gitignore

Requirements

Node.js 20 LTS (recommended)

npm

PostgreSQL

Git

1. Create the Database

You can use local PostgreSQL or a hosted PostgreSQL provider such as
Neon.

Create a PostgreSQL database.

Open the database SQL editor or a PostgreSQL client.

Run backend/database/schema.sql against the database.

The schema creates the users, products, orders, and order_items
tables and inserts eight sample products.

2. Configure Backend Environment Variables

Copy backend/.env.example to backend/.env and configure the values:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
PORT=4000

DATABASE_URL: PostgreSQL connection string.

JWT_SECRET: long, random secret (at least 32 characters
recommended).

CLIENT_ORIGIN: frontend origin allowed to access the API.

PORT: local backend port.

Never commit .env files or expose database credentials or JWT secrets.

3. Start the Backend

From the project root:

cd backend
npm install
npm run dev

The backend is expected to run locally at http://localhost:4000.

Health check:

http://localhost:4000/api/health

4. Start the Frontend

Open a second terminal from the project root:

cd frontend
npm install
npm run dev

The frontend is expected to run locally at http://localhost:5173.

During local development, Vite proxies /api requests to
http://localhost:4000. If you configure an explicit API URL, create
frontend/.env and set:

VITE_API_URL=http://localhost:4000/api

API Endpoints

Method Endpoint Authentication Purpose

GET /api/health No API/database
health check

GET /api/products No List, search,
filter, and sort
products

GET /api/products/:id No Get product
details

POST /api/auth/register No Register a
customer

POST /api/auth/login No Sign in and
receive a JWT

GET /api/auth/me Bearer token Get current token
identity

POST /api/orders Bearer token Place an order
and update stock

GET /api/orders/my Bearer token Get the signed-in
customer's order
history

POST /api/admin/products Admin token Create a product

GET /api/admin/orders Admin token List all orders

Create an Admin User

Register a normal account first. Then run the following SQL in your
PostgreSQL database, replacing the example email with the account email:

UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';

Sign out and sign in again to receive a JWT containing the updated role.
Do not make an account an admin unless you control it and understand the
permissions.

Build the Application

Frontend

cd frontend
npm install
npm run build

Backend

In a separate terminal:

cd backend
npm install
npm run build
npm start

Deployment

The frontend and backend are separate deployments. Configure environment
variables in the hosting dashboard; do not store production secrets in
source code.

Frontend deployment

Root directory: frontend

Build command: npm run build

Output directory: dist

Environment variable:

VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api

Replace YOUR-BACKEND-DOMAIN with the actual backend domain.
Rebuild/redeploy the frontend after changing this variable.

Backend deployment

Root directory: backend

Build command: npm run build

Start command: npm start

Environment variables:

DATABASE_URL=your_hosted_postgresql_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_ORIGIN=https://e-commerce-platform-pied.vercel.app
PORT=4000

Use the actual hosted PostgreSQL connection string and the exact
frontend origin. Confirm that the backend's deployment configuration
supports its Express API routes and that the deployed API health
endpoint responds successfully.

Testing Checklist

The following flows were reported as tested:

Product browsing

Search and filtering

Registration and login

Shopping cart

Order placement

Database persistence

Re-test the application after changing environment variables or
deployment settings.

Security Notes

Never commit .env files, database credentials, or JWT secrets.

Keep production secrets in the hosting provider's
environment-variable settings.

Use a strong, randomly generated JWT secret.

Use dummy/test data in screenshots. Hide passwords, access tokens,
connection strings, and personal information.

Before production use, add automated tests, rate limiting, email
verification, password reset, and other operational security
controls.

Scope and Limitations

The checkout flow creates orders but does not process card
payments.

Product images use Unsplash URLs and require an internet connection.

The newsletter form validates input; do not assume it stores or
sends newsletter subscriptions unless a backend integration has been
added.

Author

Ravindi Sandali Perera
GitHub: https://github.com/ravindi5387

License

Created for learning and internship portfolio purposes. Add an
open-source license if you intend to allow reuse or redistribution.
