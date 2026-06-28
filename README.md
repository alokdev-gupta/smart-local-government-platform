# 🇳🇵 Smart Local Government Platform
## स्मार्ट स्थानीय सरकार प्लेटफर्म

A full-stack web application designed for digitizing local government certificate services in Nepal. This platform streamlines the application, processing, and issuance of vital civic documents.

### Features
- ✅ Online certificate applications (7 types including Birth, Marriage, Citizenship)
- ✅ Secure document upload and management (Cloudinary integration)
- ✅ Real-time application status tracking
- ✅ Smart form validation & auto-fill suggestions
- ✅ PDF certificate generation with embedded QR verification
- ✅ Comprehensive Admin dashboard with analytics
- ✅ Socket.io real-time live notifications & WebSockets updates
- ✅ Role-based access control (Citizens vs. Admins)

### Tech Stack
**Frontend:** 
- React 18 + TypeScript + Vite
- TailwindCSS for modern, premium styling
- React Router DOM
- Context API & Custom Hooks
- Socket.io-client for WebSockets

**Backend:** 
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Socket.io for Real-time server pushing
- Cloudinary (File Storage)
- PDFKit (PDF Generation)
- QRCode (Code generation)

**Deployment & CI/CD:** 
- Vercel (Frontend)
- Render (Backend via Docker)
- MongoDB Atlas (Database)
- GitHub Actions (Automated CI/CD pipelines)

### Quick Start
Ensure you have Node.js 18+ and a MongoDB instance running.

#### 1. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```
Run the backend:
```bash
npm run dev
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```

### Folder Structure
```
├── backend/
│   ├── config/          # DB & Service configurations
│   ├── controllers/     # Express route handlers
│   ├── middleware/      # Auth & Error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (PDF, Validation)
│   └── utils/           # Helper functions
└── frontend/
    ├── public/
    └── src/
        ├── assets/      # Static assets
        ├── components/  # Reusable React components (common, smart, user, admin)
        ├── context/     # Global state
        ├── hooks/       # Custom React hooks (useSocket, useNotifications)
        ├── pages/       # Route-level components
        ├── services/    # Axios API wrappers
        ├── types/       # TypeScript interfaces
        └── utils/       # Helpers and constants
```

### Verification System
Each generated PDF certificate includes a unique QR code. Scanning the QR code directs to a public `/verify/:certNumber` page which validates the certificate against the database in real-time, preventing forgery.

---
*Built to empower citizens and digitize Nepal's local administrative services.*
