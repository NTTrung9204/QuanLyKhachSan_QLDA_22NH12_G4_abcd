# Hotel Management API

A RESTful API for hotel management built with Node.js, Express, and MongoDB.

## Project Structure

```
hotel-management-nodejs/
├── src/
│   ├── config/             # Configuration (database, environment)
│   ├── controllers/        # Request handlers
│   ├── models/             # Data models (Mongoose)
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── middleware/         # Middleware (auth, logging)
│   └── app.js              # Main application entry point
├── .gitignore              # Git ignore file
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hotel_management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=90d
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Features

- JWT Authentication
- User registration and login
- Hello World API (returns personalized greeting for logged-in users)

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js (for password hashing)
