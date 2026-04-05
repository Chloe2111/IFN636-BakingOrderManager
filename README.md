#  Baking Order Manager

A full-stack web application for managing a bakery business — allowing customers to browse products, place orders, and track deliveries, while administrators manage inventory, orders, and customer accounts.

**Live App:** http://13.210.72.11:3000  
**GitHub:** https://github.com/Chloe2111/IFN636-BakingOrderManager

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) |
| Deployment | AWS EC2 (Ubuntu), PM2 |
| CI/CD | GitHub Actions |

---

##  Features

### Customer
- Register and log in securely
- Browse bakery products by category
- View product details and select sizes
- Add items to cart and adjust quantities
- Place orders with delivery or pickup options
- Track order status in real time
- View order history and manage profile

### Admin
- Secure admin login portal
- Dashboard with key statistics
- Full CRUD for products (create, edit, delete)
- Customer management (view, edit, delete)
- Order management with status updates
- Internal bug reporting and tracking system

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Chloe2111/IFN636-BakingOrderManager.git
cd IFN636-BakingOrderManager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

## Demo Credentials

### Admin Account
- **Email:** julian@sweetdelights.com
- **Password:** Admin@1

### Customer Account
- **Email:** alice@example.com
- **Password:** Customer@1
---


##  Project Structure
IFN636-BakingOrderManager/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeder
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context (global state)
│       ├── pages/       # App pages
│       └── axiosConfig.jsx  # API configuration
└── README.md

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/cart` | Add to cart |
| GET | `/api/cart` | Get user cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id` | Update order status (admin) |

---

## ☁️ Deployment

The application is deployed on an **AWS EC2 Ubuntu instance** using **PM2** for process management.
```bash
# Start backend
pm2 start backend/server.js --name "backend"

# Serve frontend build
pm2 start "serve -s frontend/build -l 3000" --name "frontend"

# Check status
pm2 status
```

---

## Branching Strategy

This project follows **Git Feature Branch Workflow**:

- `main` — production-ready code
- `frontend` — frontend development
- `backend` — backend development  
- `databaseUpdate` — database schema changes
- Feature branches merged via **Pull Requests**

---

## Author

**Chloe Lee**  
QUT Student | IFN636 Software Life Cycle Management
