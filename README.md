# Organic Store — Full-Stack E-commerce Starter

A responsive organic grocery storefront inspired by the supplied screenshot, with:
- Next.js 16 App Router + TypeScript
- Tailwind CSS and shadcn/ui-style reusable UI components
- Redux Toolkit + React Redux cart state
- Animated slide-in basket sidebar with instant quantity controls and checkout shortcut
- Framer Motion animations
- Express.js backend (ES Modules: `"type": "module"`)
- MongoDB + Mongoose
- Admin login (JWT) and protected product management dashboard
- Product create, edit, delete, and stock/price changes
- Customer order page with name, phone, address, note, and Cash on Delivery
- MongoDB order storage and stock deduction after order placement
- Customer order confirmation/dashboard at `/my-orders`
- Admin order management at `/dashboard/orders` with status updates

## Requirements
- Node.js 20+
- MongoDB local or MongoDB Atlas connection string

## 1. Start backend
```bash
cd backend
cp .env.example .env
# Edit MONGO_URI and JWT_SECRET in .env
npm install
npm run seed
npm run dev
```
Backend runs at http://localhost:5000.

Seed admin credentials:
- Email: `admin@organicstore.com`
- Password: `Admin123!`

Change the password/secret before production.

## 2. Start frontend
Open a second terminal:
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## Admin dashboard
Log in at `/login`, then open `/dashboard`. The dashboard calls the Express API and lets an authenticated admin add, edit, and delete products. Open `/dashboard/orders` to review customer orders and update order status.

## Order flow
Add products to the basket, open `/order`, enter customer name, phone and delivery address, then confirm the order. The order is saved in MongoDB and the customer is redirected to `/my-orders`. Orders are visible to the admin at `/dashboard/orders`. JWT is stored in localStorage for this starter; for production, prefer secure, httpOnly cookies and add rate limiting, validation, CSRF protections, and stronger account management.

## Project structure
```text
organic-store-fullstack/
├── frontend/
│   ├── app/                 # Next.js pages and layouts
│   ├── components/          # storefront, admin, reusable UI
│   ├── lib/                 # API helpers
│   └── store/               # Redux Toolkit
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

## Notes
- Product image URLs are seeded as remote Unsplash URLs. Replace them with your own licensed product images or add an upload provider such as Cloudinary.
- This is a runnable starter, not a payment-ready production store. Checkout/payment, order fulfillment, email verification, and password reset are not included.
