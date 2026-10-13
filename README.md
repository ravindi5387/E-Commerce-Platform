Verdant — Everyday, Elevated

A full-stack e-commerce web application for discovering products, managing a shopping cart, and placing orders. Built with React and TypeScript on the frontend, Node.js and Express on the backend, and PostgreSQL for persistent data storage.

Deployment note: The live website and health endpoint below were shared/tested during deployment. The health endpoint returned status: ok and database: connected. Verify each route before describing it as production-ready.

🔗 Project Links

Resource

Link

GitHub repository

E-Commerce-Platform

Live website

Verdant — E-Commerce Platform

Backend health endpoint

API Health Check

API base path

https://e-commerce-platform-pied.vercel.app/api

Deployment note: These URLs use the same Vercel domain based on the URLs tested during deployment. If your backend is deployed under a separate Vercel project/domain, replace the API links and API base path with the actual backend domain.

📸 Screenshots

Put the image files in a root-level screenshots/ folder next to this README.md. The folder was empty during the latest local check, so these images will appear on GitHub only after you copy them into that folder and push them.

Website screenshots

Page / feature

Expected filename

Homepage

screenshots/01-homepage.png

Products and filtering

screenshots/02-products-and-filtering.png

Product details

screenshots/03-product-details.png

Shopping cart

screenshots/04-shopping-cart.png

Registration

screenshots/05-registration.png

Login

screenshots/06-login.png

Checkout and order confirmation

screenshots/07-checkout-order-confirmation.png

Order history

screenshots/08-order-history.png

Homepage

Products and filtering

Product details

Shopping cart

Registration

Login

Checkout and order confirmation

Order history

Database evidence

Suggested filenames, if you capture these screenshots:

screenshots/09-database-tables.png

screenshots/10-database-products.png

screenshots/11-database-users.png

screenshots/12-database-orders.png

screenshots/13-database-order-items.png

API testing evidence

Suggested Postman screenshot filenames:

screenshots/14-api-health.png

screenshots/15-api-products.png

screenshots/16-api-register.png

screenshots/17-api-login.png

screenshots/18-api-authenticated-user.png (only if implemented)

screenshots/19-api-create-order.png

screenshots/20-api-order-history.png

Privacy: Mask passwords, JWT/access tokens, database connection strings, and private user information in screenshots. Remove any image reference above if you do not capture or implement that feature/endpoint.

✨ Features

The project is intended to support common e-commerce workflows. Verify each item against the current implementation before claiming it is complete:

Browse the product catalogue.

Search, filter, and sort products.

View product details.

Add products to a shopping cart and manage quantities.

Wishlist functionality, if enabled in the current build.

User registration and login.

JWT-based authentication for protected API requests.

bcrypt password hashing.

Order placement and order history, where implemented.

Protected administrative product/order operations, where implemented.

PostgreSQL data persistence.

Known limitations

Online card payments: A payment gateway/card-payment integration is not confirmed as implemented. Do not claim real card payments are processed unless a provider has been integrated and tested.

Newsletter: UI validation does not necessarily mean subscriptions are saved or emails are sent. Describe newsletter functionality as complete only if the backend integration exists.

Admin and account-specific routes: Include them in a demo only after verifying authentication, permissions, and responses.

🧰 Technology Stack

Frontend

React

TypeScript

Vite

HTML and CSS

Backend

Node.js

Express.js

TypeScript

REST API

JSON Web Token (JWT) authentication

bcrypt password hashing

Zod validation, where configured

Database and tools

PostgreSQL

Prisma and/or SQL schema, depending on the current implementation

Git and GitHub

Postman

Vercel deployment

Keep this list aligned with the dependencies and code actually present in the repository.

🏗️ Project Structure

E-Commerce-Platform/
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
├── backend/
│ ├── src/
│ ├── database/
│ │ └── schema.sql
│ ├── package.json
│ └── ...
├── screenshots/
├── .gitignore
└── README.md

The exact source-file layout may vary slightly by branch.

⚙️ Run Locally

Prerequisites

Node.js version supported by the project's package.json

npm

PostgreSQL, local or hosted

Git

1. Clone the repository

git clone https://github.com/ravindi5387/E-Commerce-Platform.git
cd E-Commerce-Platform

2. Install frontend dependencies

cd frontend
npm install

3. Configure the frontend

Create frontend/.env (or the environment file expected by the code):

VITE_API_URL=http://localhost:4000/api

The frontend should read this as import.meta.env.VITE_API_URL. If the backend uses another port or API prefix, use the configured value.

4. Start the frontend

From frontend/:

npm run dev

Open the local URL printed by Vite in the terminal (commonly http://localhost:5173).

5. Install backend dependencies

Open a second terminal at the repository root:

cd backend
npm install

6. Configure the backend

Create backend/.env locally. Example variable names:

PORT=4000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173

Use the exact variable names expected by the backend code. Never commit .env files, passwords, database URLs, or JWT secrets.

7. Set up PostgreSQL

Create a PostgreSQL database.

Set DATABASE_URL in backend/.env.

If backend/database/schema.sql is the schema used by this version, run it against your database using your PostgreSQL client.

If the project uses Prisma migrations instead, follow the scripts and Prisma configuration in the repository.

Confirm the required tables and product records exist.

Do not run a raw SQL schema and Prisma migrations blindly; follow the database setup that matches the current code.

8. Start the backend

From backend/, run the development script in backend/package.json. In many TypeScript projects, this is:

npm run dev

If that script is unavailable, inspect the scripts section of backend/package.json and use the configured command.

9. Verify the backend

If /api/health is configured, open:

http://localhost:4000/api/health

The deployed health endpoint returned a response similar to:

{
"status": "ok",
"database": "connected"
}

Your local response may differ.

🔌 API Endpoints

These paths were used during testing/planning. Confirm them against the backend router code because endpoint names, fields, and status codes can vary.

Method

Endpoint

Purpose

GET

/api/health

Health/database connectivity check

GET

/api/products

Retrieve products

POST

/api/auth/register

Register a user

POST

/api/auth/login

Log in

GET

/api/auth/me

Current authenticated user, if implemented

POST

/api/orders

Create an order, if implemented at this route

GET

/api/orders/my

Retrieve the current user's orders, if implemented at this route

Example: products request

GET /api/products

Full deployed URL used for testing:

https://e-commerce-platform-pied.vercel.app/api/products

Example: registration request

In Postman, select POST → Body → raw → JSON. Adjust field names to match your backend's validation schema.

{
"name": "Test User",
"email": "testuser@example.com",
"password": "Use-A-Unique-Test-Password-123!"
}

Use test credentials only. Never publish real passwords or authentication tokens.

🚀 Deployment

Frontend on Vercel

Import the GitHub repository into Vercel.

Set the frontend project's Root Directory to frontend.

Configure the required frontend environment variables, including VITE_API_URL.

Deploy and test the main user flows.

Backend on Vercel

Configure the backend as a separate Vercel project if that matches your setup.

Set its Root Directory to backend.

Configure the variables required by the backend, for example:

DATABASE_URL

JWT_SECRET

CLIENT_ORIGIN

Ensure the entry point and routes are compatible with the deployment platform.

Deploy and test /api/health and the actual API routes.

Environment variable reminders

VITE_API_URL should point to the deployed backend API base, normally ending in /api if the frontend constructs requests that way.

CLIENT_ORIGIN should exactly match the deployed frontend origin.

Redeploy after changing production environment variables.

Never expose backend secrets through frontend variables or GitHub.

🧪 Testing Checklist

Record only results you have actually tested:

Homepage loads.

Product catalogue returns products.

Search/filter/sort works, if implemented.

Product details page opens.

Cart updates correctly.

Registration validates input and creates a user.

Login works with valid credentials.

Invalid credentials are rejected.

Passwords are stored as hashes.

Protected endpoints reject unauthenticated requests.

Order creation persists order data, if implemented.

Order history is limited to the authenticated user, if implemented.

Health endpoint reports database connectivity.

Secrets are not exposed in source code or screenshots.

🔐 Security Notes

Hash passwords with bcrypt; never store plain-text passwords.

Validate user input on the server.

Authenticate protected routes and authorize admin actions.

Store secrets in environment variables.

Use HTTPS in deployment.

Do not commit .env, database credentials, JWT secrets, access tokens, or private user data.

Use test accounts and anonymized database screenshots in public documentation.

👩‍💻 Author

Ravindi Sandali Perera

GitHub: @ravindi5387

LinkedIn: Ravindi Sandali Perera

📄 License

No license has been specified here. Unless a LICENSE file is added, do not assume others have permission to reuse or redistribute this code.
