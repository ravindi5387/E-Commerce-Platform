Verdant — Everyday, Elevated

A full-stack e-commerce web application for discovering products, managing a shopping cart, and placing orders. Built with React and TypeScript on the frontend, Node.js and Express on the backend, and PostgreSQL for persistent data storage.

Deployment note: The live website and health endpoint below were shared/tested during deployment. The health endpoint returned status: ok and database: connected. Verify each route before describing it as production-ready.

🔗 Project Links

GitHub repository : [https://github.com/ravindi5387/E-Commerce-Platform](url)

Live website :[ https://e-commerce-platform-pied.vercel.app/](url)

Backend health endpoint :[ https://e-commerce-platform-pied.vercel.app/api/health](url)

API base path : [https://e-commerce-platform-pied.vercel.app/api](url)

Deployment note: These URLs use the same Vercel domain based on the URLs tested during deployment. If your backend is deployed under a separate Vercel project/domain, replace the API links and API base path with the actual backend domain.

📸 Screenshots

Put the image files in a root-level screenshots/ folder next to this README.md. The folder was empty during the latest local check, so these images will appear on GitHub only after you copy them into that folder and push them.


Homepage

<img width="1917" height="971" alt="01-homepage" src="https://github.com/user-attachments/assets/bc219c86-102b-4366-8522-1f851788ad5f" />


Products and filtering

<img width="1882" height="947" alt="02-products-and-filtering" src="https://github.com/user-attachments/assets/fff5ed90-33ee-4ba6-9927-6c823d9ed4e2" />



Product details

<img width="1877" height="947" alt="03-product-details" src="https://github.com/user-attachments/assets/ff387c3e-08d4-475b-bc87-018bf127e6cf" />


Shopping cart

<img width="590" height="921" alt="04-shopping-cart" src="https://github.com/user-attachments/assets/ae01f3cc-e4d6-4974-a5ed-4106614d15c5" />

Registration

<img width="1902" height="962" alt="05-registration" src="https://github.com/user-attachments/assets/6a5ad7d4-5975-42a7-931b-6c346a6c71f0" />


Login

<img width="1897" height="940" alt="06-login" src="https://github.com/user-attachments/assets/311ac89b-0843-4e22-9b28-9f260428075a" />


Checkout and order confirmation

<img width="560" height="750" alt="07-checkout-order-confirmation" src="https://github.com/user-attachments/assets/86bb0f12-782c-4984-aa6d-bcf543e043c9" />


Order history

<img width="1880" height="920" alt="08-order-history" src="https://github.com/user-attachments/assets/55166fcc-bf8d-460b-8a2d-86888d6ee9bf" />


Homepage

<img width="1917" height="971" alt="01-homepage" src="https://github.com/user-attachments/assets/d5b9f2d8-7968-4ea0-8a70-3edbc3a61ff3" />


Database evidence

database-tables

<img width="1917" height="900" alt="09-database-tables" src="https://github.com/user-attachments/assets/03385a99-ec14-497d-86fd-874fb990c7e8" />

database-products

<img width="1612" height="641" alt="10-database-products" src="https://github.com/user-attachments/assets/af4231ed-9505-4008-9b9d-1923ef64ee0f" />


database-users

<img width="1910" height="711" alt="11-database-users" src="https://github.com/user-attachments/assets/24696b1e-c4cc-4b1f-8c16-288fbe536f25" />


database-orders

<img width="1892" height="737" alt="12-database-orders" src="https://github.com/user-attachments/assets/bb6c0dd5-31b9-4bd7-97b7-a99c202268aa" />

database-order-items

<img width="1917" height="607" alt="13-database-order-items" src="https://github.com/user-attachments/assets/1aa85099-9a1f-4c63-b9f3-37d2d3d71fd6" />


API testing evidence

api-products

<img width="1917" height="1010" alt="15-api-products" src="https://github.com/user-attachments/assets/25685678-39c6-4919-9b87-392bcd094550" />

api-register

<img width="1905" height="997" alt="16-api-register" src="https://github.com/user-attachments/assets/e8933486-440a-4c14-a547-d7b3ae74d6b8" />

api-login

<img width="1917" height="1015" alt="17-api-login" src="https://github.com/user-attachments/assets/ab24895a-a119-4c45-85dd-0fa7ad398c24" />


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

<img width="1300" height="1210" alt="image" src="https://github.com/user-attachments/assets/fdd0eebc-32b9-4942-9bab-a4034b63de39" />

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

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/0143b18c-0eea-4f4f-8e57-177b68df2b97" />

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
