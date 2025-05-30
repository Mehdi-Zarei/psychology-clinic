![image](https://github.com/Mehdi-Zarei/psychology-clinic/raw/43ea4ddcf801c96cea16c5383741dcaedcc6fbf4/public/images/1.png)
 
 # 🧠 Psychology Clinic REST API

Welcome to the **Psychology Clinic** backend! This API powers a full-featured platform where users can book appointments with psychologists, read and write reviews, and consume educational articles. Built with Node.js, MongoDB, Redis, and more – it’s designed for performance, security, and a seamless experience.

---

## 🚀 Table of Contents

- [✨ Features](#features)
- [⚙️ Technology Stack](#technology-stack)
- [📦 Installation & Setup](#installation--setup)
- [🗄️ Database & Replica Set Warning](#database--replica-set-warning)
- [🛡️ Authentication & Security](#authentication--security)
- [📚 API Documentation](#api-documentation)
- [🔮 Future Plans](#future-plans)
- [📋 Dependencies](#dependencies)
- [✉️ Contact & License](#contact--license)

---

## ✨ Features

A comprehensive platform bringing together users and mental health professionals, with:

- **Seamless Onboarding:**  
  Simple sign-up flow for users and psychologists, with role-based access and admin approval.
- **Secure Authentication:**  
  Multi-factor OTP login, JWT access & refresh tokens, Redis-backed sessions.
- **Dynamic Scheduling:**  
  Psychologists publish available slots; users browse in real time and reserve with atomic MongoDB transactions.
- **Automated Notifications & Workflows:**  
  SMS alerts for bookings and reminders, automatic session state transitions (`reserved` → `done`).
- **Content & Community:**  
  Admin-powered article publishing; users can like, comment, and rate—with lazy-loaded comments for performance.
- **Role Management & Admin Tools:**  
  Fine-grained control over user, psychologist, and content lifecycle (approve, reject, remove).

---

### 🔐 Auth & OTP

- **User Signup & Verification:**

  - User submits phone/email → receives a one-time code via SMS.

  - OTP stored in Redis with **1-minute TTL**; new OTPs locked until expiry.

- **Token-Based Security:**

  - **Access Tokens:** Short-lived JWT for each request.
  - **Refresh Tokens:** Long-lived, **hashed** and stored in Redis for session refresh.

- **Protection Against Abuse:**

  - Rate-limit OTP requests, replay protection via Redis, and role-based guards (`USER`, `PSYCHOLOGIST`, `ADMIN`).

  ***

### 👥 User & Psychologist Flow

1. **User Journey:**
   - Register → receive OTP → verify phone → set password → log in.
   - Browse psychologist profiles, read verified reviews, and book sessions.
2. **Psychologist Onboarding:**
   - Sign up as a regular user → upload credentials.
   - Admin reviews documentation → promotes account to “Psychologist.”
   - Psychologist publishes their **available dates & time slots**.
3. **Booking Experience:**
   - Users view live availability calendar.
   - Select slot → reserve instantly (transactional safety).
   - Both user & psychologist receive confirmation SMS with appointment details.

---

### 📅 Appointment Booking

- **Atomic booking** using MongoDB
- **Transactional Safety:**  
  Uses **MongoDB transactions** to ensure no double-booking.
- **Persistent Scheduling:**
  - **Node-Schedule** jobs transition each session from `reserved` → `done` at end time.
  - Jobs are re-initialized on server restart to guarantee reliability.
- **Real-Time Notifications:**  
  SMS sent at booking time and again as a reminder shortly before the session.
- **Replica-Set Requirement:**  
  MongoDB must be running as a **replica set** (`replSetName: "rs0"`) to support transactions.

> **⚠️❗ Warning:** Transactions require MongoDB replica set mode
>
> ```js
> rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] });
> ```
>
> Without `replSetName: "rs0"`, booking transactions will fail with errors!  
> 👉 [MongoDB Replica Set Tutorial](https://dev.to/sarwarasik/mongodb-transactions-error-transaction-numbers-are-only-allowed-on-a-replica-set-member-or-mongos-4083)

### 💬 Reviews & Ratings

- Users can **read verified reviews** of psychologists
- Users submit reviews & stars (hidden until admin approval)
- Admin panel shows **all reviews** (even unapproved ones)

### 📝 Articles

- Admins can **create & manage articles**
- Users can **like**, **comment**, **rate**, and see **view counts**
- **Comment loading on scroll** for performance (infinite pagination)

### 🛠️ Admin Controls

- Approve/reject psychologist registrations
- Remove psychologists or fetch total count
- Approve/reject article & psychologist reviews

---

## ⚙️ Technology Stack

- **Node.js** & **Express.js**
- **MongoDB** (Mongoose)
- **Redis** (ioredis for OTP & refresh tokens)
- **Joi** for schema validation
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT
- **node-schedule** for background jobs
- **multer** for file uploads (avatars, article images)
- **Swagger (swagger-jsdoc + swagger-ui-express)** for API docs
- **Axios**, **cors**, **dotenv**, **cookie-parser**, **nanoid**, **slugify**, **nodemailer**

---

## 📦 Installation & Setup

```bash
git clone https://github.com/Mehdi-Zarei/psychology-clinic.git
cd psychology-clinic-backend
npm install
```

1.Environment

- Copy .env.example → .env

- Fill in DB, Redis, JWT secret, Axios configs.

  2.MongoDB Replica Set

- Ensure your MongoDB is running as a replica set (see warning above)

  3.Run

- npm run dev

## 🗄️ Database & Replica Set Warning

This project uses MongoDB transactions for booking safety.
Transactions only work if your MongoDB instance is in replica set mode:

```js
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }],
});
```

Without this, any transaction (e.g., appointment booking) will throw:

```vbnet
MongoError: Transactions are not supported on standalone servers.
```

[📖 Enable Replica Set Guide](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/)

## 🛡️ Authentication & Security

- OTP (1 min TTL in Redis)

- Access Token (JWT)

- Refresh Token (hashed + Redis, 30 days TTL)

- Role-based guards: ADMIN, PSYCHOLOGIST, USER

## 📚 API Documentation

- [All endpoints are documented with Swagger!](http://localhost:3000/apis/v1/#/)

## 🔮 Future Plans

- Online Consultations:
  - Users book & pay via gateway
  - Live sessions via Google Meet, WhatsApp, etc.
- Analytics Dashboard for admin insights
- Mobile App integration

## 📋 Dependencies

```json
"dependencies": {
  "axios": "^1.8.4",
  "bcryptjs": "^3.0.2",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "ioredis": "^5.6.0",
  "joi": "^17.13.3",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.12.1",
  "multer": "^1.4.5-lts.2",
  "nanoid": "^3.3.4",
  "node-schedule": "^2.1.1",
  "nodemailer": "^6.10.0",
  "slugify": "^1.6.6",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1"
}
```

## 📞 Contact

- **Email:** mahdizareiofficial@gmail.com

---

## 📜 License

MIT License

[Copyright (c) 2025 Mehdi Zarei](https://github.com/Mehdi-Zarei)

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the “Software”), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.
