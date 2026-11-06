# Node.js Auth & CRUD App

A simple authentication and user management (CRUD) application with role-based access (User and Admin) built with Node.js, Express, and MongoDB.

## Features
- **Authentication:** Register and login with email and password (passwords hashed using `bcryptjs`, sessions managed via `jsonwebtoken`).
- **User Role:** View and update profile (edit name and upload profile image using `multer`).
- **Admin Role:** Full CRUD access (view all users, edit user details, and delete users).

---

## Current Backend Setup

### Project Structure
```
backend/
├── config/             # Database connection logic
├── controllers/        # Business logic for auth and user CRUD
├── middleware/         # JWT auth guard and Multer file upload setup
├── models/             # Mongoose schemas (User model)
├── routes/             # API route definitions
├── uploads/            # Local storage for profile images
├── .env                # Secrets (Port, MongoDB URI, JWT Secret)
├── .gitignore          # Excludes node_modules, .env, and uploads
├── package.json        # Project scripts and dependencies
└── server.js           # Main Express server entry point
```

---

## Configuration

### 1. Environment Variables
Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/node_auth_db
JWT_SECRET=your_jwt_secret_key
```

### 2. How to Run

Navigate into the `backend` directory:
```bash
cd backend
```

Install dependencies (if not already installed):
```bash
npm install
```

Start the development server with auto-reload:
```bash
npm run dev
```
