# Node.js + Express Backend Setup

A secure, scalable backend API built with Express, featuring JWT authentication, password hashing, and image upload capabilities. This setup is designed to integrate seamlessly with modern frontend frameworks like Next.js.

## Tech Stack & Dependencies

| Package | Purpose |
| --- | --- |
| **express** | The core web framework to handle HTTP requests (GET, POST, PUT, DELETE) and API routing. |
| **dotenv** | Loads secret configurations (ports, JWT secrets, DB connections) from a `.env` file into `process.env`. |
| **cors** | Enables Cross-Origin Resource Sharing, allowing frontends (like Next.js on port 3000) to safely communicate with this backend. |
| **bcryptjs** | Hashes passwords with salt rounds, ensuring plain-text passwords are never stored in the database. |
| **jsonwebtoken** | Creates and verifies JWT tokens to manage secure, stateless user sessions and logins. |
| **multer** | Middleware for handling `multipart/form-data`, which is required for processing image and file uploads. |
| **nodemon** | A development utility that automatically restarts the Node server whenever code changes are saved. |

## Getting Started

### 1. Install Dependencies

Install the core packages:

```bash
npm install express dotenv cors bcryptjs jsonwebtoken multer

```

Install the development dependency:

```bash
npm install --save-dev nodemon

```

### 2. Environment Configuration

Create a `.env` file in the root of your project and add your secrets:

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here

```

### 3. Running the Server

To start the server with auto-reloading enabled, run:

```bash
npx nodemon server.js

```

*(Optional: You can add `"dev": "nodemon server.js"` to the `"scripts"` section of your `package.json` so you can run it using `npm run dev`)*