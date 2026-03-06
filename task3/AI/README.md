# Login System - Task 3

A complete login system built with Express.js, MongoDB (Mongoose), Sessions, and JavaScript Classes.

## Features

- User Registration
- User Login with Authentication
- Protected Dashboard Route
- Session Management
- Logout Functionality
- Password Hashing with bcrypt

## Project Structure

```
AI/
├── models/
│   └── User.js           # User class with register() and login() methods
├── middleware/
│   └── auth.js           # Authentication middleware
├── public/
│   ├── register.html     # Registration page
│   ├── login.html        # Login page
│   ├── dashboard.html    # Protected dashboard page
│   └── styles.css        # CSS styling
├── server.js             # Main Express server
├── package.json          # Dependencies
└── README.md            # This file
```

## Requirements

- Node.js (v14 or higher)
- MongoDB (running locally or remote)

## Installation

1. **Install MongoDB** (if not already installed):
    - Download from: https://www.mongodb.com/try/download/community
    - Install and start MongoDB service

2. **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the Application

1. **Start MongoDB**:
    - Make sure MongoDB is running on `mongodb://localhost:27017`
    - The application will automatically create `studentDB` database and `users` collection

2. **Start the Server**:

    ```bash
    npm start
    ```

    Or for development with auto-restart:

    ```bash
    npm run dev
    ```

3. **Access the Application**:
    - Open your browser and navigate to: `http://localhost:3000`
    - You'll be redirected to the login page
    - Click "Register here" to create a new account

## API Endpoints

### POST /register

- **Description**: Register a new user
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "success": true, "message": "User registered successfully" }`

### POST /login

- **Description**: Login with username and password
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "success": true, "message": "Login successful" }`
- **Action**: Creates a session with `req.session.user = username`

### GET /dashboard

- **Description**: Protected route - shows dashboard
- **Authentication**: Required
- **Response**: Dashboard HTML page with "Welcome username"

### GET /logout

- **Description**: Logout and destroy session
- **Response**: Redirects to login page
- **Action**: `req.session.destroy()`

## User Class Methods

```javascript
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register() {
        // Registers user in MongoDB
        // Hashes password using bcrypt
        // Returns success/error message
    }

    async login() {
        // Checks user credentials in MongoDB
        // Compares hashed password
        // Returns success/error message
    }
}
```

## Authentication Middleware

```javascript
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect("/login.html");
    }
};
```

## Database Schema

**Database Name**: `studentDB`  
**Collection Name**: `users`

**User Schema**:

```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

## Testing the Application

1. **Register a new user**:
    - Go to http://localhost:3000/register.html
    - Enter username and password
    - Click "Register"
    - You should see: "User registered successfully"

2. **Login**:
    - Go to http://localhost:3000/login.html
    - Enter your credentials
    - Click "Login"
    - You should see: "Login successful"
    - You'll be redirected to dashboard

3. **Dashboard** (Protected):
    - After login, you'll see: "Welcome [username]"
    - Only accessible if logged in

4. **Logout**:
    - Click "Logout" button on dashboard
    - Session will be destroyed
    - You'll be redirected to login page

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- Session-based authentication
- Protected routes using middleware
- Input validation
- Unique username constraint

## Technologies Used

- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **express-session**: Session management
- **bcrypt**: Password hashing
- **HTML/CSS/JavaScript**: Frontend

## Expected Output

✅ **Register**: "User registered successfully"  
✅ **Login**: "Login successful"  
✅ **Dashboard**: "Welcome username"  
✅ **Logout**: "Logout successful" (redirects to login)

## Notes

- Session cookie expires after 24 hours
- MongoDB must be running before starting the server
- All passwords are securely hashed
- Dashboard route is protected by authentication middleware
