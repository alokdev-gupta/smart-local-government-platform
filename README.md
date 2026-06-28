<div align="center">
  <img src="frontend/public/Emblem_of_Nepal.svg.png" alt="Emblem of Nepal" width="120" />
  <h1>🇳🇵 Smart Local Government Platform</h1>
  <p><strong>स्मार्ट स्थानीय सरकार प्लेटफर्म</strong></p>
  <p>A comprehensive, full-stack digital governance solution designed to modernize local government services in Nepal.</p>
</div>

<hr />

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Key Features (A to Z)](#key-features-a-to-z)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Installation](#step-by-step-installation)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

---

## 🏛️ About the Project
The **Smart Local Government Platform** aims to digitize and streamline the process of acquiring civic certificates (Birth, Marriage, Citizenship, etc.) from local ward offices in Nepal. It eliminates physical paperwork, reduces processing times, and provides a transparent, trackable system for both citizens and government administrators.

---

## ✨ Key Features (A to Z)

### 👥 For Citizens (Users)
- **Authentication:** Secure Registration and Login using JWT.
- **Certificate Applications:** Apply for 7 distinct certificates:
  - 👶 Birth Certificate
  - 💒 Marriage Certificate
  - 🪪 Citizenship Certificate
  - 🏠 Residence Certificate
  - 📋 Death Certificate
  - 💰 Income Certificate
  - 📝 Character Certificate
- **AI Smart Validation:** Rule-based AI checks the form before submission, ensuring no missing fields, valid age limits, and sufficient document uploads without requiring a server round-trip.
- **Auto-Fill Data:** Intelligently detects previous applications and offers one-click auto-fill for personal and address details.
- **Real-Time Tracking:** Track application status (Pending, Under Review, Approved, Rejected) in real-time.
- **Live Notifications:** Receive instant in-app notifications (via WebSockets/Socket.io) the moment an admin approves or rejects an application.
- **Digital Certificates & QR Code:** Download officially generated PDF certificates containing a unique, verifiable QR Code.

### 👨‍💼 For Administrators
- **Admin Dashboard:** High-level metrics showing total applications, pending reviews, and approval rates.
- **Application Review:** Securely view submitted documents, verify applicant details, and Approve or Reject applications with official remarks.
- **Automated Issuance:** Approving an application automatically generates a digital PDF certificate, uploads it to the cloud, and issues it to the user.
- **User Management:** Manage all registered citizens within the platform.

### 🔒 Security & System Features
- **Public Verification Portal:** Anyone can scan a certificate's QR code or enter a Certificate ID into the public verification page to confirm its authenticity.
- **Cloud Document Storage:** Seamless integration with Cloudinary for secure storage of sensitive documents.
- **Responsive UI:** A highly polished, animated, and responsive user interface built with React and TailwindCSS.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
- **React.js (v18)** - Component-based UI library
- **TypeScript** - For type safety and better developer experience
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework for premium styling
- **React Router DOM** - For client-side routing
- **Socket.io-client** - For receiving real-time WebSocket events
- **Axios** - For making API requests

### Backend (Server-Side)
- **Node.js & Express.js** - Robust REST API framework
- **MongoDB & Mongoose** - NoSQL Database for scalable data storage
- **Socket.io** - For pushing real-time events to the frontend
- **JSON Web Token (JWT)** - For secure authentication
- **Cloudinary** - For storing uploaded user documents and generated PDFs
- **PDFKit** - For dynamic, server-side PDF generation
- **QRCode** - For generating verifiable QR codes on certificates

---

## 📁 Folder Structure

```text
Smart Local Government Platform/
├── backend/
│   ├── config/          # DB, Cloudinary configuration
│   ├── controllers/     # Route logic (Auth, Admin, Applications)
│   ├── middleware/      # JWT Auth and Global Error Handling
│   ├── models/          # MongoDB Schemas (User, Application, Certificate, Notification)
│   ├── routes/          # Express API Routes
│   ├── services/        # Business logic (Smart Validation, PDF Generation)
│   ├── utils/           # Helpers (ID generation, API formatting)
│   ├── Dockerfile       # Containerization config
│   └── server.js        # Entry point for backend
│
└── frontend/
    ├── public/          # Static assets (Emblem_of_Nepal, etc.)
    ├── src/
    │   ├── components/  # Reusable UI components (Modals, Toasts, Skeletons, Navbar)
    │   ├── hooks/       # Custom hooks (useSocket, useNotifications, useAuth)
    │   ├── pages/       # Main views (Dashboard, Apply, Admin panels)
    │   ├── services/    # API calling logic
    │   ├── types/       # TypeScript interface definitions
    │   └── utils/       # Formatting helpers and constants
    ├── index.html       # Entry HTML
    └── package.json     # Frontend dependencies
```

---

## ⚙️ Prerequisites
Before installing, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Git**
- A **MongoDB Atlas** Account (or local MongoDB installed)
- A **Cloudinary** Account (Free tier is sufficient)

---

## 🚀 Step-by-Step Installation

### 1. Clone the Repository
*(If you haven't already)*
```bash
git clone https://github.com/your-username/smart-gov-nepal.git
cd smart-gov-nepal
```

### 2. Setup the Backend
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
npm install
```
Create a file named `.env` in the root of the `backend` folder and add your variables (see [Environment Variables](#environment-variables) section below).

Start the backend server:
```bash
npm run dev
# The server will start on http://localhost:5000
```

### 3. Setup the Frontend
Open a **new** terminal window and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```
Create a file named `.env` in the root of the `frontend` folder and add your variables (see below).

Start the frontend server:
```bash
npm run dev
# The app will start on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend `.env`
Create this file inside the `backend/` folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Cloudinary Setup (Get these from your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL for CORS & Socket.io
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
Create this file inside the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 💻 Usage Guide

### 1. User Flow
1. **Register** a new account on the platform.
2. Go to **Apply for Certificate** and select a type (e.g., Birth Certificate).
3. Fill out personal details. If you've applied before, click **Auto-fill Details** on the smart banner.
4. Click **Run Check** (Smart Form Assistant) before submitting to ensure you have no errors.
5. Submit and track your status in **My Applications**.

### 2. Admin Flow
1. In your MongoDB database, find a user you created and change their `"role"` to `"admin"`.
2. Login to that account to access the **Admin Dashboard**.
3. View all incoming applications.
4. Click **Review**, enter remarks, and click **Approve**.
5. *Magic:* The backend generates the PDF certificate with a QR code, saves it to Cloudinary, and instantly sends a WebSocket notification to the user!

---

## ☁️ Deployment

The project includes configurations for automated CI/CD deployment.

### Backend (Render / Docker)
- The backend is Docker-ready with a `Dockerfile`.
- We use **Render** for backend deployment.

### Frontend (Vercel)
- The frontend is optimized for **Vercel**.

### GitHub Actions
A `.github/workflows/deploy.yml` file is included. By setting up your API keys in GitHub Secrets (`RENDER_API_KEY`, `VERCEL_TOKEN`, etc.), pushing to the `main` branch will automatically build and deploy both the frontend and backend.

---

<div align="center">
  <p>Built to empower citizens and digitize Nepal's local administrative services.</p>
</div>
