# Full-Stack Modern E-Commerce Platform

A production-grade, full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js), Vite, Tailwind CSS and Cloudinary. 

This platform supports complete customer shopping workflows (product discovery, cart management, wishlist, checkout and order tracking) alongside a rich administrative dashboard for product, inventory, user, review and order lifecycle management.

---

## 🔗 Repository Information

* **GitHub Repository URL:** `https://github.com/<your-username>/<your-repo-name>`

---

## 🛠 Tech Stack & Architecture

### **Frontend (`/client`)**
* **Core:** React 19, React Router v7, Redux Toolkit, Context API (Auth, Cart, Wishlist)
* **Styling & UI:** Tailwind CSS v3, Lucide React Icons
* **Build Tool:** Vite
* **HTTP Client:** Axios (with centralized interceptors & JWT refresh token support)

### **Backend (`/server`)**
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB with Mongoose ODM (utilizing compound & text search indexes)
* **Authentication:** JWT (JSON Web Tokens) with secure HTTP-only cookies and bearer auth headers
* **Security:** Helmet HTTP headers, dynamic CORS origin filtering
* **Asset Storage:** Cloudinary CDN integration with dynamic image resizing

---

## 📁 Project Structure

ecommerce-platform/
├── client/                     # React (Vite) Frontend Application
│   ├── src/
│   │   ├── common/             # ProtectedRoute & AdminRoute components
│   │   ├── components/         # UI elements, layouts, modals, and badges
│   │   ├── context/            # Auth, Cart, and Wishlist context providers
│   │   ├── pages/              # Customer & Admin pages
│   │   │   └── admin/          # Admin Dashboard views
│   │   ├── utils/              # Axios instance & Cloudinary helper utilities
│   │   ├── App.jsx             # React Router setup & global Error Boundary
│   │   └── main.jsx            # React root entry point
│   ├── .env.example            # Client environment variables blueprint
│   ├── index.html              # HTML entry point
│   ├── package.json            # Client dependencies & scripts
│   ├── vercel.json             # Vercel SPA rewrite configurations
│   └── vite.config.js          # Vite config & API proxy setup
│
├── server/                     # Express REST API Application
│   ├── config/                 # MongoDB database connection logic
│   ├── controllers/            # Request logic handlers
│   ├── middleware/             # Auth, admin guard, and error handling
│   ├── models/                 # Mongoose schemas & high-performance indexes
│   ├── routes/                 # Express API endpoints
│   ├── .env.example            # Server environment variables blueprint
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Application entry point & fail-fast checks
│
├── .gitignore                  # Git root ignore file
└── README.md                   # Complete project documentation