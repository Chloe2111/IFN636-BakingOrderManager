# Baking Order Manager

A full-stack bakery ordering web application built with the MERN stack, 
featuring a customer storefront and an admin management dashboard.

** Live Demo:** http://13.210.72.11:3000

---

## What This App Does

Customers can browse bakery products, add items to their cart, place orders, 
and track delivery status. Admins can manage products, customers, orders, 
and internal bug reports through a dedicated dashboard.

---

## Built With

- **React.js** + Tailwind CSS — Frontend
- **Node.js** + Express.js — Backend API
- **MongoDB Atlas** — Cloud Database
- **JWT** — Authentication
- **AWS EC2** + PM2 — Deployment
- **GitHub Actions** — CI/CD

---

## Quick Start
# Clone the repo
git clone https://github.com/Chloe2111/IFN636-BakingOrderManager.git

# Install backend
cd backend && npm install

# .env file
MONGO_URI=mongodb+srv://n12520691_db_user:n12520691_13499431@bakingordermanager.61isbbh.mongodb.net/BakingOrderManager?appName=BakingOrderManager
JWT_SECRET=2J8zqkP7VN6bxzg+Wy7DQZCA3Yx8mF3Bl0kch6HYtFs=
PORT=5001

# Run backend
node server.js

# Install and run frontend (new terminal)
cd ../frontend && npm install && npm start

---

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Production code |
| `frontend` | Frontend development |
| `backend` | Backend development |
| `databaseUpdate` | Schema changes |

---

## 👩‍💻 Author

**Chloe Lee** — QUT IFN636, Semester 2 2025
