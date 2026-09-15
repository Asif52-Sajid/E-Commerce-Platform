# Full-Stack Modern E-Commerce Platform

A production-ready, full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js), Vite, Tailwind CSS and Cloudinary.

This platform supports complete customer shopping workflows (product discovery, dynamic search, cart management, wishlist, checkout and order tracking) alongside a rich administrative dashboard for product management, inventory, user oversight, review moderation and order status updates.

---

## 🔗 Repository & Live Deployment Links

* **GitHub Repository:** `https://github.com/Asif52-Sajid/E-Commerce-Platform.git`

---

## 📋 Prerequisites & Account Requirements

Before installing and running the project, make sure you have the following software and external services configured:

### 1. Local Development Software

* **Node.js**: `v18.0.0` or higher installed ([Download Node.js](https://nodejs.org/))
* **npm**: `v9.0.0` or higher (packaged with Node.js)
* **Git**: Installed on your system ([Download Git](https://git-scm.com/))

### 2. Required External Services & Accounts

* **MongoDB Database**: A free-tier cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a locally running MongoDB server.
* **Cloudinary Account**: A free account at [Cloudinary](https://cloudinary.com/) to obtain API credentials for cloud image uploads and dynamic optimization.

---

## 🛠 Tech Stack Overview

* **Frontend (`/client`):** React 19, React Router v7, Redux Toolkit, Context API (Auth, Cart, Wishlist), Tailwind CSS v3, Lucide React Icons, Vite.
* **Backend (`/server`):** Node.js, Express.js, MongoDB with Mongoose ODM (utilizing compound & text search indexes).
* **Authentication:** JWT (JSON Web Tokens) with secure HTTP-only cookies and bearer authorization header support.
* **Asset Storage:** Cloudinary CDN with automated formatting (`f_auto`) and quality compression (`q_auto`).
* **Security & Optimization:** Helmet HTTP headers, dynamic CORS domain whitelist and top-level React Error Boundary protection.

---

## 🚀 Step-by-Step Installation & Local Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Asif52-Sajid/E-Commerce-Platform.git
cd E-Commerce-Platform
```

### 2. Configure Environment Variables

Create `.env` configuration files in both the `server/` and `client/` directories based on the blueprints below.

#### A. Server Configuration (`server/.env`)

```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### B. Client Configuration (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

> **Security note:** Never commit real `.env` files, database credentials, JWT secrets or Cloudinary API secrets to GitHub. Use `.env.example` files with placeholder values for documentation.

### 3. Install Dependencies

#### Install Server Dependencies

```bash
cd server
npm install
```

#### Install Client Dependencies

```bash
cd ../client
npm install
```

---

## 🏃 Run the Application Locally

### 1. Start the Backend API Server

In your first terminal window:

```bash
cd server
npm run dev
# Backend running at: http://localhost:5001
```

### 2. Start the Frontend Client Application

In a second terminal window:

```bash
cd client
npm run dev
# Frontend running at: http://localhost:5173
```

---

## 💻 How to Use the Application

### For Customers

- **Account Registration & Login:** Create an account or sign in.
- **Browsing Catalog:** Filter products by category, price, search text or popularity.
- **Cart & Wishlist:** Add items to cart or save them to your wishlist.
- **Checkout:** Complete orders using the Cash-on-Delivery (COD) option and view order summaries.
- **My Orders:** Track order status and purchase history from your profile dashboard.
- **Product Reviews:** Eligible customers can submit product ratings and reviews.

### For Administrators

- **Access Dashboard:** Log in with an admin account and navigate to `/admin/dashboard`.
- **Product Management:** Add new products with multi-image Cloudinary upload, edit prices, set primary display images, update stock levels and assign categories.
- **Category Management:** Manage category names and slugs with built-in soft-delete protection.
- **Order Status Lifecycle:** Update customer orders through statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Review Moderation:** Review customer ratings and remove spam or inappropriate feedback.
- **Inventory Management:** Monitor product stock and update inventory levels where supported.

---

## 🔐 Security Considerations

This project is designed with production security in mind.

Key security practices include:

- Password hashing before database storage.
- JWT-based authentication.
- HTTP-only cookies where applicable.
- Protected customer and admin routes.
- Server-side authorization checks.
- Environment variables for sensitive configuration.
- CORS domain restrictions.
- Helmet security headers.
- Backend input validation.
- Safe API error responses.
- Cloudinary credentials kept on the server.
- Product image upload restrictions.
- Prevention of unauthorized resource access.

> Always use strong production secrets and never expose private credentials in frontend code or public repositories.

---

## ⚡ Performance Considerations

The application uses several techniques to improve performance:

- Cloudinary CDN for product images.
- Automatic image format optimization with `f_auto`.
- Automatic quality optimization with `q_auto`.
- Optimized product image delivery.
- Database indexes for relevant queries.
- API pagination where implemented.
- Responsive image loading where appropriate.
- React component optimization where beneficial.
- Production builds through Vite.

---

## 🧪 Testing Checklist

Before considering the project production-ready, verify:

### Authentication

- [ ] Customer registration works.
- [ ] Customer login works.
- [ ] Logout works.
- [ ] Protected routes reject unauthenticated users.
- [ ] Admin routes reject regular customers.
- [ ] Invalid credentials are handled safely.

### Products

- [ ] Products load correctly.
- [ ] Product details work.
- [ ] Search works.
- [ ] Filtering works.
- [ ] Categories work.
- [ ] Product images load correctly.
- [ ] Admin can create/edit/delete products.

### Shopping

- [ ] Add to cart works.
- [ ] Quantity updates work.
- [ ] Remove from cart works.
- [ ] Wishlist works.
- [ ] Checkout works.
- [ ] Cash on Delivery orders can be placed.

### Orders

- [ ] Customers can view their orders.
- [ ] Customers cannot view other customers' orders.
- [ ] Admin can manage orders.
- [ ] Order status updates work.

### Reviews

- [ ] Eligible customers can submit reviews.
- [ ] Rating validation works.
- [ ] Customers cannot review products they are not eligible to review.
- [ ] Reviews display correctly.
- [ ] Admin review moderation works if implemented.

### Cloudinary

- [ ] Admin image upload works.
- [ ] Image deletion works.
- [ ] Image URLs are stored correctly.
- [ ] Cloudinary secrets are never exposed to the frontend.

### Responsive Design

- [ ] Mobile layout works.
- [ ] Tablet layout works.
- [ ] Desktop layout works.
- [ ] No unwanted horizontal scrolling.
- [ ] Navigation works on small screens.
- [ ] Forms and modals work on mobile.

---

## 🚧 Future Improvements

The following features can be added in future versions:

- Online payment gateway integration.
- Automated email notifications.
- Advanced coupon and discount system.
- Advanced inventory tracking and stock history.
- More advanced analytics.
- Additional shipping integrations.
- Additional customer communication features.

These features are intentionally not required for the current MVP/portfolio version.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Commit your changes.
6. Open a pull request.

---

## 📄 License

This project is open-source and released under the MIT License.