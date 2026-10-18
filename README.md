# COMP 3123 - Assignment 1 (Backend API)
**Student ID:** 101468069  
**Student Name:** Dharwyn Ivor Olpindo  
**Course:** COMP 3123 - Full Stack Development I  

## Project Overview
A RESTful backend API built with Node.js, Express, and MongoDB. The application features user registration and authentication using JSON Web Tokens (JWT) and password hashing with bcrypt, as well as protected employee management endpoints (CRUD operations).

## Tech Stack
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas & Mongoose ORM
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
## Security & Middleware Configuration

### Helmet Security Headers
To ensure robust security and protect the application from well-known web vulnerabilities (such as cross-site scripting, clickjacking, and MIME-sniffing), **Helmet** is integrated directly into the Express application pipeline in `server.js`.

**Code Verification (`server.js`):**
```javascript
const helmet = require('helmet');
const app = express();

// Helmet is initialized here to set secure HTTP headers
app.use(helmet());

## Sample Marking Credentials

To facilitate evaluation and testing of the API endpoints, you may use the following pre-configured non-sensitive test credentials:

### Test Account 1 (Primary User)
* **Username:** `testuser101 and testuser102`
* **Email:** `testuser101@example.com and testuser102@example.com`
* **Password:** `Password123!`

### Test Account 2 (Secondary User for Ownership / Authorization Tests)
* **Username:** `testuser202`
* **Email:** `testuser202@example.com`
* **Password:** `Password123!`