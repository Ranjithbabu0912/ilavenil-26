# 🎉 ILAVENIL'26 – Event Registration & Management System

A full-stack web application built to manage inter-college event registrations, payments, QR-based attendance, and admin verification.

---

## 🚀 Features

### 👤 User Features
- User authentication using **Clerk**
- Event registration
- Secure payment submission
- Payment status tracking (NOT PAID / PENDING / APPROVED / REJECTED)
- Rejection reason visibility
- Retry payment after rejection
- QR code generation and conformation email after approval
- QR-based attendance check-in

### 🛡️ Admin Features
- Admin-only dashboard
- View all registrations & payments
- Search by name / email / UTR
- Approve or reject payments with reason
- Automatic email notifications
- Attendance tracking via QR scanner
- Secure role-based access

---

## 🧰 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Clerk Authentication
- HTML5 QR Code Scanner

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Nodemailer
- Cloudinary (image uploads)

### Deployment
- Frontend: Vercel
- Backend: Vercel / Render
- Database: MongoDB Atlas

---

## 📸 Screenshots (Optional)

>Add screenshots of:
> - Home page
> - Registration
> - Payment page
> - Admin dashboard
> - QR scanner

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Ranjithbabu0912/ilavenil-26.git
cd ilavenil-26
```
### 2️⃣ Install dependencies

```Frontend
cd client
npm install
```
```Backend
cd server
npm install
```


### 🔐 Environment Variables

```Frontend (.env)
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

```Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
CLERK_SECRET_KEY=your_clerk_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```


### ▶️ Running the Project
```Backend
cd server
npm run dev
```

```Frontend
cd client
npm run dev
```


### 🛡️ Admin Access
> To access admin routes:

> - Login using Clerk
> - Set publicMetadata in Clerk Dashboard:
```
{
  "role": "admin"
}
```
> - Logout & login again


### 📁 Folder Structure
``` text
client/
 ├─ components/
 ├─ pages/
 ├─ services/
 ├─ context/
 └─ main.jsx

server/
 ├─ controllers/
 ├─ routes/
 ├─ models/
 ├─ middlewares/
 ├─ utils/
 └─ server.js

```

### 🔮 Future Improvements

> - WhatsApp notifications
> - Payment retry limits
> - Admin activity logs
> - Analytics dashboard
> - Multi-event QR passes



### 👨‍💻 Author

Ranjith Babu \
Full-Stack Web Developer \
📧 ranjithbabu.dev@gmail.com



### 📄 License

This project is licensed under the MIT License.