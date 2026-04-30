                                                           # 💊 MediStore Frontend

Frontend for **MediStore** – an online OTC medicine shop.

Built with **Next.js (App Router), TypeScript, and Tailwind CSS** with a modern, responsive UI.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Better Auth Client

---

## Features

### Public

- Homepage (Hero, Categories, Featured, Trust)
- Shop page
- Medicine details page
- Search & pagination

### Customer

- Register / Login
- Email verification
- Add to cart
- Checkout (COD)
- View orders
- Profile management

### Seller

- Dashboard
- Manage medicines
- View and update orders

### Admin

- Dashboard
- Manage users
- Manage categories
- View all orders

---

## Routes

### Public

/  
/shop  
/shop/:id  
/login  
/register  
/contact

### Customer

/cart  
/checkout  
/orders  
/orders/:id  
/profile

### Seller

/seller/dashboard  
/seller/medicines  
/seller/orders

### Admin

/admin  
/admin/users  
/admin/orders  
/admin/categories

---

## Cart System

- Zustand for global state
- Synced with backend
- Persistent across sessions

---

## Payments

Supports:

- Cash on Delivery

---

## UI/UX

- Fully responsive design
- Dark mode support
- Clean card-based layout
- Modern e-commerce style

---

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api/v1
AUTH_URL=http://localhost:5000/api/v1/auth

npm install
npm run dev
```

Notes
Uses Better Auth for authentication
Session-based login
Protected routes handled via middleware

Author

MediStore Frontend – Built with modern Next.js architecture
