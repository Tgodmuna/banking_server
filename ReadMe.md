
### **README.md**: Banking Server System Project  

---

# **Banking Server System**

A robust and scalable banking server application built with **Node.js**, **Express.js**, and **MongoDB**. This project demonstrates backend best practices, secure user authentication, efficient database design, and modern caching techniques to ensure high performance.

---

## **Features**

- **User Management**:
  - User registration and secure login with password hashing.
  - Profile management (update details, upload profile picture).
  - Role-based access control for `admin` and `user`.
  - Two-factor authentication and password reset capabilities.

- **Account Management**:
  - Create and manage multiple accounts (e.g., savings, current).
  - Unique account numbers generation.
  - Support for multiple currencies with balance tracking.

- **Transaction Management**:
  - Deposit, withdrawal, and transfer functionalities.
  - Transaction logging and history retrieval.
  - Cancel pending transactions (where applicable).

- **Security**:
  - Route protection using middleware for authentication and authorization.
  - User input validation using **Joi**.
  - HTTP headers secured with **Helmet**.
  - Prevent injection attacks using input sanitization and query validation.

- **Performance Optimization**:
  - Caching frequently accessed data using **Redis**.
  - Optimized queries with **indexed database models**.

- **Error Handling and Logging**:
  - Centralized error handling for predictable and debuggable responses.
  - Logging of errors and application info using **Winston**.
  - Detailed logs for debugging and monitoring.

---

## **Technologies Used**

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB (NoSQL)
- **Caching**: Redis (In-memory data store)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Error Handling**: Winston Logger
- **Security**: Helmet, bcrypt
- **Logging**: Winston Logger
- **Testing**: Jest
- **File Upload**:
  - Secure file upload using **Multer**.
  - Support for profile pictures and documents.
  - File size and type validation.
  - Cloud storage integration with **AWS S3** (Under Construction).
  - Automatic image optimization and resizing (Under Construction).

---

## **Project Structure**

The project follows a **feature-based modular structure** to ensure scalability and maintainability.

```
banking-server-system/
├── src/
│   ├── controllers/        # Handles request logic for routes
│   ├── models/             # Database schemas (User, Account, Transaction)
│   ├── routes/             # Route definitions for features
│   ├── middlewares/        # Middleware for authentication, error handling, etc.
│   ├── services/           # Business logic for interacting with DB and other services
│   ├── utils/              # Utility functions (e.g., token generation, validation helpers)
│   ├── config/             # Configuration files for environment variables, Redis, etc.
│   ├── logs/               # Winston log files
│   └── app.js              # Application entry point
│   └── views              # ejs files

├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── ./upload              # Directory for uploaded files (e.g., profile pictures)
              
├── package.json            # Project dependencies
├── README.md               # Documentation
```


## **Setup and Installation**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tgodmuna/banking-server-system.git
   cd banking-server-system
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   - Create a `.env` file in the root directory and configure the following variables:

     ```env
     PORT=5000
     DB_URI=mongodb://localhost:27017/banking
     JWT_SECRET=your_jwt_secret
     REDIS_HOST=localhost
     REDIS_PORT=6379
     ```

4. **Run the Application**

   ```bash
   npm start
   ```

5. **Access the API**
   - Base URL: `http://localhost:5000/api`

---

## **Key API Endpoints**

### **Authentication**

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and retrieve a JWT token.
- `POST /api/auth/logout`: Logout a user.
- `POST /api/auth/resetPassword`: Request password reset.
- `POST /api/auth/verifyOTP`: verify OTP.
- `POST /api/auth/update-password`: reset password.



### **User Operations**

- `GET /api/users/me`: Fetch logged-in user profile.
- `PUT /api/users/me`: Update profile information.
- `POST /api/users/me/upload-pic`: Upload a profile picture.
- `GET /api/users/profilePic`: Fetch logged-in user profile pic.


### **Account Operations**

- `GET /api/user/view-me`: view profile.
- `POST /api/user/update`: Update account details.
- `POST /api/user/upoad`: upload profile.
- `DELETE /api/accounts/:id`: Close an account.

### **Transaction Operations**

- `POST /api/transactions/deposit`: Deposit money into an account.
- `POST /api/transactions/withdraw`: Withdraw money from an account.
- `POST /api/transactions/transfer`: Transfer funds between accounts.
- `POST /api/transactions/account-details`: view account-details.
- `GET /api/transactions/history/:id`: Fetch account transaction history.

---

## **Best Practices Implemented**

1. **Folder Structure**:
   - Organized by feature to make it easy to scale the codebase.

2. **Error Handling**:
   - Centralized error handling middleware with categorized error responses.

3. **Secure User Authentication**:
   - Passwords are hashed using **bcrypt**.
   - Tokens are securely generated and verified using **JWT**.

4. **Caching for Speed**:
   - Redis is used to cache frequently accessed data like user session info, reducing DB load.

5. **Logging**:
   - **Winston** for application-level logs (e.g., errors, warnings, info).
   - Logs are stored in a file for debugging and monitoring purposes.

6. **Database Design**:
   - **Normalized structure**: Referencing is used to maintain relationships between users, accounts, and transactions.
   - Proper indexing for faster query performance.

7. **Middleware**:
   - Used to authenticate requests, validate inputs, and manage errors consistently.

---

## **Planned Enhancements**

- Integrate payment gateways for external fund transfers.
- Add support for recurring payments.
- Implement advanced analytics for account summaries.

---

## **Contributing**

Contributions are welcome! Please fork the repository, create a branch, and submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the LICENSE file for more details.

---
