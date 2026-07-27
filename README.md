# 🏟️ Turf Booking System

A full-stack MERN web application designed to simplify the process of discovering and reserving sports turfs. The platform provides a seamless booking experience for users while offering administrators a centralized dashboard to manage turfs, bookings, and users. It incorporates secure authentication, cloud-based image management, and a responsive interface to deliver a modern and efficient booking solution.

---

## 📖 About the Project

Finding and booking sports turfs is often a manual and time-consuming process. This project digitizes the entire workflow by allowing users to browse available turfs, view detailed information, and reserve slots online through an intuitive interface.

The system follows a client-server architecture built with the MERN stack and implements industry-standard authentication and authorization mechanisms to ensure security and scalability. Administrators can efficiently manage turfs, bookings, and users through a dedicated dashboard.

---

## ✨ Key Features

### 👤 User Module
- Secure user registration and login
- Google OAuth Sign-In
- JWT-based Authentication
- Browse all available turfs
- View turf details and amenities
- Book available time slots
- View booking history
- Update profile information
- Responsive design for desktop and mobile devices

### 🛠️ Admin Module
- Secure admin login
- Dashboard with management features
- Add new turfs
- Update existing turf information
- Delete turfs
- Upload and manage turf images
- Manage bookings
- Manage registered users

---

## 🔒 Security Features

- JWT Authentication
- Google OAuth Integration
- Password Encryption using bcrypt
- Role-Based Authorization
- Protected API Routes
- Input Validation
- Secure REST APIs

---

## ☁️ Image Management

The application uses **Multer** and **Cloudinary** to efficiently manage turf images.

- Upload images from the admin dashboard
- Store images securely on Cloudinary
- Save image URLs in MongoDB
- Faster image loading and optimized delivery

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT
- Google OAuth

### Image Storage
- Multer
- Cloudinary

### Deployment
- Vercel
- Render
- MongoDB Atlas

---

## 📂 Project Structure

```text
Turf-Booking-System
│
├── client
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   └── assets
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── utils
│
└── README.md
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/praveen6235/Turf-Booking-System.git
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=

MONGO_URI=

JWT_SECRET=

JWT_EXPIRES_IN=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Login Page
- Register Page
- Turf Listing
- Turf Details
- Booking Page
- User Dashboard
- Admin Dashboard

---

## 🎯 Future Enhancements

- 💳 Razorpay Payment Gateway Integration
- 📅 Real-Time Slot Availability
- 🔔 Email & SMS Notifications
- ⭐ Ratings and Reviews
- 📍 Google Maps Integration
- 📱 Progressive Web App (PWA)
- 📊 Booking Analytics Dashboard
- 🎟️ Discount Coupons & Promo Codes

---

## 🌟 Project Highlights

- Developed a scalable full-stack MERN application following RESTful architecture.
- Implemented secure JWT authentication with Google OAuth login.
- Designed role-based access control for Admin and User modules.
- Integrated Cloudinary for efficient cloud image storage.
- Built responsive UI using React.js and Tailwind CSS.
- Developed REST APIs for authentication, turf management, booking management, and user operations.
- Deployed the frontend on Vercel and backend on Render using MongoDB Atlas.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## 👨‍💻 Author

**Praveen Bollam**

- GitHub: https://github.com/praveen6235
- LinkedIn: *(Add your LinkedIn Profile)*

---

## ⭐ Show Your Support

If you found this project useful, please consider giving it a ⭐ on GitHub. It motivates me to build and share more projects!
