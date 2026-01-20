# **Frontend Documentation**

## **Overview**

This frontend application serves as the user-facing interface for monitoring sensor data, managing devices, and handling user authentication. It communicates with the backend API for login, registration, profile access, sensor data retrieval, and device configuration.

The frontend is built using **React + TypeScript**, and is structured into logical pages representing key sections of the system.

---

# **Project Structure**

### **Home.tsx**

A landing page that provides general entry into the application, often functioning as the app's public welcome screen.

### **Login.tsx**

Handles user authentication by allowing users to log into their account using their email and password and retrieves a JWT token from the backend.

### **Register.tsx**

Provides the user registration interface, sending name, email, and password to the backend to create a new account.

### **ResetPassword.tsx**

Allows users to reset their password (if implemented fully with backend routes) or request a password reset flow.

### **Dashboard.tsx**

The main authenticated view where users can see live or recent sensor data aggregated from the backend’s `/api/sensors` endpoint.

### **DeviceConfig.tsx**

A page dedicated to configuring device details such as names, labels, or locations; interacts with backend routes that manage devices.

### **Reports.tsx**

Displays historical sensor data reports, using aggregated queries to the backend’s sensor data storage.

### **Profile.tsx**

Shows the currently logged-in user’s profile details, retrieved through the protected `/api/user/profile` route.

### **profileConfig.tsx**

Allows users to update their profile information (such as display name or email), interacting with protected user modification endpoints on the backend.

---

# **How the Frontend Interacts With the Backend**

### **Authentication Flow**

* Sends login credentials → `/api/auth/login`
* Receives JWT token
* Stores token in local storage
* Uses token on all protected routes (e.g., profile, dashboard)

### **Sensor Data Display**

* Dashboard and Reports pages fetch data from `/api/sensors`
* Data is visualized as charts, tables, or real-time indicators

### **Device Configuration**

* DeviceConfig interfaces with backend device endpoints to:

  * Update device names
  * Assign locations
  * View device metadata

### **User Profile**

* Profile and profileConfig use `/api/user/profile` and related update endpoints (if implemented)

---

# **Requirements**

* Node.js
* NPM
* Backend server running (for API communication)