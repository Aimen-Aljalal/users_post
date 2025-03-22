

# **Users & Posts API**  

This project is a **Node.js** application that provides an API for managing users and posts. It integrates **MongoDB**, **authentication**, **real-time communication**, and **file handling**.  

## **Technologies & Libraries Used**  

### **Backend Framework & Middleware**  
- **Express** – Lightweight Node.js framework for handling routes and middleware.  
- **Body-Parser** – Parses incoming request bodies (JSON & URL-encoded data).  
- **CORS** – Enables cross-origin resource sharing.  
- **Dotenv** – Manages environment variables securely.  

### **Database & ORM**  
- **MongoDB** – NoSQL database for storing users and posts.  
- **Mongoose** – ODM for interacting with MongoDB in an object-oriented way.  
- **Connect-MongoDB-Session** – Stores user sessions in MongoDB.  

### **Authentication & Security**  
- **BcryptJS** – Hashes passwords for secure authentication.  
- **JSON Web Token (JWT)** – Implements token-based authentication.  
- **Express-Session** – Manages user sessions securely.  

### **Real-Time Communication**  
- **Socket.IO** – Enables real-time updates using WebSocket.  

### **File Handling & PDF Generation**  
- **Multer** – Handles file uploads (e.g., images).  
- **PDFKit** – Generates custom PDF files.  

### **Validation & Pagination**  
- **Express-Validator** – Validates user input.  
- **Pagination** – Implements pagination for fetching large sets of data.  

### **Development Tools**  
- **Nodemon** – Automatically restarts the server during development.  

## **Environment Variables (.env)**  
The project uses `process.env` to store sensitive information like database connection strings, JWT secrets, and API keys.  

## **How to Run the Project**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Aimen-Aljalal/users_post.git
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Create a `.env` file and configure your environment variables.  
4. Run the application:  
   ```bash
   npm start
   ```  

---

