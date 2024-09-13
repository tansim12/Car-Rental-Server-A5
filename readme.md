
# Car Rental Reservation System Backend 

##  Introduction
This is the backend for a Car Rental Reservation System. It handles CRUD operations for cars, bookings, user authentication, and authorization. The project is built with Node.js, Express.js, TypeScript, and MongoDB.

## 🔗 Live URL

[Car Rental Reservation System](https://assignment-51-l2.vercel.app)


## Technologies Used
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Zod
- Bcrypt


## Features
- User Authentication and Authorization (JWT-based)
- CRUD Operations for Cars
- Booking System for Renting Cars
- Middleware for Error Handling
- Input Validation using Zod
- Transaction and Rollback (if necessary)

- **Order Management**
  - Create a new order
  - Retrieve all orders
  - Retrieve orders by user email
  - Update inventory when an order is created


 **Clone the repository**

   ```sh
   git clone 

   cd Car-Rental-Reservation-System-Backend
  
```
📦 Install Dependencies

---
```bash

$ npm install

```
# ⚙️ Configure Environment Variables
## Create a `.env` file in the root of the project and add the following environment variables:

```bash

NODE_ENV="development"
DB_NAME= your DB name
PORT=5000
USER= your user name
PASS= your password
BCRYPT_NUMBER= number
SECRET_ACCESS_TOKEN= your access token
SECRET_REFRESH_TOKEN= your refresh token
SECRET_ACCESS_TOKEN_TIME=10d
SECRET_REFRESH_TOKEN_TIME=365d
CLOUD_NAME=dgm9w4vwh
CLOUD_API_KEY=625361979527927
CLOUD_SEC=TMdoo62lEFDSwpL9GvBQ1XVUnIo
AAMAR_PAY_SEARCH_TNX_BASE_URL= 
AAMAR_PAY_STORE_ID=
AAMAR_PAY_SIGNATURE_KEY= 
AAMAR_PAY_HIT_API= 
BASE_URL=
FRONTEND_URL=


```
# Running the app

```TYPESCRIPT
# watch mode
$ npm run start


```
The server should be running on http://localhost:5000.


<!-- . -->


## Ensure the code adheres to a consistent style by running:

```TYPESCRIPT
npm run lint
```
# LINTING FIX
## Fix the code by running:
```TYPESCRIPT
npm run lint:fix

```