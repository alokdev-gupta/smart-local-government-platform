# Smart Local Government Platform — Nepal 🇳🇵

A production-ready full-stack MERN application for Nepal's local government digital services.

## 🏗️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite 5 + TailwindCSS 3 + React Router v6  
**Backend:** Node.js + Express.js + MongoDB (Mongoose) + JWT Auth

---

## 📁 Project Structure

```
Smart Local Government Platform/
├── backend/                 # Express REST API
│   ├── server.js            # Main server entry
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── cloudinary.js    # Cloudinary config
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Application.js   # Application schema
│   │   └── Certificate.js   # Certificate schema
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT protect + adminOnly
│   │   └── errorMiddleware.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── applicationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── applicationRoutes.js
│   ├── .env                 # Local environment (DO NOT COMMIT)
│   └── .env.example
│
└── frontend/                # React TypeScript SPA
    ├── src/
    │   ├── types/index.ts   # All TypeScript types
    │   ├── context/AuthContext.tsx
    │   ├── hooks/useAuth.ts
    │   ├── services/api.ts  # Axios API layer
    │   ├── components/common/
    │   │   ├── Navbar.tsx
    │   │   ├── Loader.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── PrivateRoute.tsx
    │   │   └── AdminRoute.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Profile.tsx
    │   │   ├── auth/Login.tsx
    │   │   ├── auth/Register.tsx
    │   │   ├── dashboard/UserDashboard.tsx
    │   │   ├── dashboard/AdminDashboard.tsx
    │   │   ├── applications/
    │   │   │   ├── ApplyCertificate.tsx
    │   │   │   ├── MyApplications.tsx
    │   │   │   └── ApplicationDetail.tsx
    │   │   ├── certificates/
    │   │   │   ├── MyCertificates.tsx
    │   │   │   └── VerifyCertificate.tsx
    │   │   └── admin/
    │   │       ├── AllApplications.tsx
    │   │       ├── AdminApplicationDetail.tsx
    │   │       └── ManageUsers.tsx
    │   ├── App.tsx          # React Router setup
    │   └── main.tsx         # Entry point
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

The API will start at **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Ensure VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartgov
JWT_SECRET=minimum_32_character_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/update-profile` | Protected |
| PUT | `/api/auth/change-password` | Protected |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications` | User |
| GET | `/api/applications` | User |
| GET | `/api/applications/:id` | User |
| PUT | `/api/applications/:id` | User |
| DELETE | `/api/applications/:id` | User |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/applications/admin/stats` | Admin |
| GET | `/api/applications/admin/all-applications` | Admin |
| PUT | `/api/applications/admin/applications/:id/approve` | Admin |
| PUT | `/api/applications/admin/applications/:id/reject` | Admin |
| GET | `/api/applications/admin/users` | Admin |

### Certificates
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/applications/certificates/my` | User |
| GET | `/api/applications/certificates/verify/:certNumber` | Public |

---

## ✨ Features

- 🔐 JWT Authentication with 7-day expiry
- 📋 7 certificate types (birth, citizenship, residence, marriage, death, income, character)
- 📊 Real-time application status tracking with visual timeline
- 🤖 AI-ready smart form data field (`smartFormData`)
- 🛡️ Role-based access control (User / Admin)
- 📱 Fully responsive dark UI with glassmorphism design
- 🔍 Public certificate verification by certificate number
- 🇳🇵 Nepali language support (Devanagari font)
- 🚦 Rate limiting (100 req/15 min global, 20 req/15 min auth)
- ☁️ Cloudinary integration for document uploads
- 📄 PDF certificate generation ready (pdfkit)
- 🔐 QR code verification system

---

## 🧑‍💻 Creating Admin User

To create an admin user, register normally then update the role directly in MongoDB:
```js
db.users.updateOne({ email: "admin@smartgov.np" }, { $set: { role: "admin" } })
```

---

## 🌐 Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/verify/:certNumber` | Certificate verification | Public |
| `/dashboard` | User dashboard | User |
| `/apply` | Apply for certificate | User |
| `/applications` | My applications | User |
| `/applications/:id` | Application detail | User |
| `/certificates` | My certificates | User |
| `/profile` | Profile settings | User |
| `/admin` | Admin dashboard | Admin |
| `/admin/applications` | All applications | Admin |
| `/admin/applications/:id` | Review application | Admin |
| `/admin/users` | Manage users | Admin |
