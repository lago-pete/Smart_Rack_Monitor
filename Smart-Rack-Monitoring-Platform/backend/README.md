# **Project Structure**

### **Environment Variables**

The server can be configured using the following environment variables:

* `PORT` – Port the server listens on (default: `8080`)
* `MONGO_URI` – MongoDB connection URI (default: `mongodb://localhost:27017/sensorDB`)
* `JWT_SECRET` – Secret key for signing JWT tokens (default: `sense-telecso`)
* `CI` – Set to `true` to skip MongoDB connection during CI builds

---

### **Web Server**

The web server powers the main application interface and provides:

* User authentication using JSON Web Tokens
* Static file hosting for the frontend
* REST API routes for user profiles and account operations

---

### **Device Server**

The device server accepts and processes incoming sensor data from IoT devices, providing:

* Submission endpoint for temperature, humidity, and status data
* Storage of all sensor payloads in MongoDB
* Simple posting mechanism suitable for low-power devices

---

### **Authentication**

The authentication system allows users to register, log in, and access protected resources using JWT:

* Registration with hashed passwords (bcrypt)
* Login that generates a 1-hour JWT
* Middleware-protected routes requiring token verification

---

## **Requirements**

* Node.js
* MongoDB
* NPM

---

## **Main Dependencies**

* express
* mongoose
* cors
* bcryptjs
* jsonwebtoken

