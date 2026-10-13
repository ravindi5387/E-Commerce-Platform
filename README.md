# Verdant — Full-Stack E-Commerce Website (Task 4)

**Brand:** Verdant — Everyday, Elevated  
**Frontend:** React + TypeScript + Vite  
**Backend:** Node.js + Express + TypeScript  
**Database:** PostgreSQL  
**Authentication:** bcrypt password hashing + JWT

This project is organized into separate `frontend` and `backend` folders so each can be installed, tested, and deployed independently.

## Included features

### Frontend
- Responsive, light sage-green and cream design
- Product catalogue, search, category filters and sorting
- Product detail modal, wishlist and cart quantity controls
- Register/sign-in UI
- Checkout form that submits orders to the backend (no card payments)
- Customer order history
- Newsletter form validation

### Backend
- Product listing, searching, filtering, sorting and details
- Registration and login
- bcrypt password hashing and JWT authentication
- Authenticated order creation using a database transaction
- Stock validation and stock updates
- Customer order history
- Admin-only product creation and all-orders listing
- Input validation with Zod and parameterized SQL

## Requirements
Install Node.js 20 LTS (recommended) and create a PostgreSQL database.

## 1. Create the database
Use a PostgreSQL provider such as Neon or local PostgreSQL. Run `backend/database/schema.sql` in the database SQL editor. It creates `users`, `products`, `orders`, and `order_items`, and inserts eight sample products.

## 2. Configure backend environment
Copy `backend/.env.example` to `backend/.env`, then configure:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — long random secret (32+ characters)
- `CLIENT_ORIGIN=http://localhost:5173`
- `PORT=4000`

Never commit `.env` or expose database credentials.

## 3. Start backend
Open a terminal in the project root:

```bash
cd backend
npm install
npm run dev
```

Backend: `http://localhost:4000`  
Health check: `http://localhost:4000/api/health`

## 4. Start frontend
Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

During local development, Vite proxies `/api` requests to `http://localhost:4000`. If you deploy the backend separately, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`, then rebuild/redeploy.

## API endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | API/database health |
| GET | `/api/products` | No | Product listing/search/filter/sort |
| GET | `/api/products/:id` | No | Product details |
| POST | `/api/auth/register` | No | Create customer account |
| POST | `/api/auth/login` | No | Sign in and receive JWT |
| GET | `/api/auth/me` | Bearer token | Current token identity |
| POST | `/api/orders` | Bearer token | Place order and reduce stock |
| GET | `/api/orders/my` | Bearer token | Customer order history |
| POST | `/api/admin/products` | Admin token | Add a product |
| GET | `/api/admin/orders` | Admin token | List all orders |

## Create an admin user
Register a normal account, then run the following SQL using that account's email:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Sign out and sign in again to receive a token with the updated role.

## Build
Frontend:

```bash
cd frontend
npm run build
```

Backend (in a separate terminal):

```bash
cd backend
npm run build
npm start
```

## Important scope note
The order API saves orders but does not collect card payments. Integrate a legitimate payment provider before treating the site as a real store. Product images use Unsplash URLs and require internet access. Before production use, add automated tests, rate limiting, email verification/password reset, and other operational security controls.

## Deployment
- Deploy `frontend` to Vercel (build command `npm run build`, output `dist`).
- Deploy `backend` to a Node hosting provider (build command `npm run build`, start command `npm start`).
- Configure backend environment variables on the host and set `CLIENT_ORIGIN` to the deployed frontend origin.
- Configure frontend `VITE_API_URL` to the backend URL ending in `/api`, then redeploy frontend.
