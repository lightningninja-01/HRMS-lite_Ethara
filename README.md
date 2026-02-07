# 🧑‍💼 HRMS Lite – Employee & Attendance Management System

A lightweight full-stack Human Resource Management System (HRMS) built as part of a Full Stack Internship Assignment.

The system simulates a basic internal HR tool that allows an admin to manage employees and track attendance with a clean, simple, and professional interface.

---

## 🚀 Live Demo

Frontend: https://hrms-lite-ethara.vercel.app/
Backend API: https://hrms-lite-ethara.onrender.com/

---

## 📌 Project Overview

HRMS Lite is designed to replicate a small internal HR dashboard used by organizations to manage employees and their daily attendance.

The application provides:

• Employee creation and management  
• Attendance tracking (Present / Absent)  
• Attendance history per employee  
• Date-based attendance filtering  
• Dashboard summary  
• Proper validations  
• RESTful APIs  
• Persistent database storage  

The focus is on realistic usability rather than a demo-style project.

---

## 🛠 Tech Stack Used

### Frontend
- React (Vite)
- Bootstrap
- Axios

### Backend
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- Gunicorn

### Database
- SQLite

### Deployment
- Render (Backend hosting)
- Vercel (Frontend hosting)
- GitHub (Version control)

---

## ✨ Features

### 👨‍💼 Employee Management
✔ Add employee  
✔ Unique employee ID  
✔ Email validation  
✔ View employee list  
✔ Delete employee  

### 📅 Attendance Management
✔ Mark Present/Absent  
✔ Attendance history per employee  
✔ Filter attendance by date  
✔ Present days counter  

### 📊 Dashboard
✔ Total employees  
✔ Total present  
✔ Total absent  

### 🎨 UI/UX Improvements
✔ Loading state  
✔ Empty state  
✔ Error state  
✔ Clean layout  
✔ Professional spacing & typography  

---

## 📂 Project Structure

hrms-lite
│
├── backend
│ ├── app.py
│ ├── requirements.txt
│ └── hrms.db
│
├── frontend
│ ├── src
│ ├── package.json
│ └── vite.config.js
│
└── README.md

yaml
Copy code

---

## ▶️ Steps to Run the Project Locally

### 1️⃣ Clone the repository

git clone https://github.com/lightningninja-01/HRMS-lite_Ethara
cd hrms-lite

yaml
Copy code

---

### 2️⃣ Run Backend (Flask)

cd backend
python -m venv venv
venv\Scripts\activate (Windows)
pip install -r requirements.txt
python app.py

yaml
Copy code

Backend runs at:
http://127.0.0.1:5000

yaml
Copy code

---

### 3️⃣ Run Frontend (React)

Open a new terminal:

cd frontend
npm install
npm run dev

yaml
Copy code

Frontend runs at:
http://localhost:5173

yaml
Copy code

---

## 🔐 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /employees | Get all employees |
| POST | /employees | Add employee |
| DELETE | /employees/:id | Delete employee |
| POST | /attendance | Mark attendance |
| GET | /attendance/:id | Get attendance history |
| GET | /dashboard | Dashboard summary |

---

## ✅ Server-side Validation Implemented

• Required fields check  
• Valid email format  
• Unique employee ID  
• Proper HTTP status codes  
• Meaningful error messages  

---

## ⚠️ Assumptions / Limitations

• Single admin user (no authentication required)  
• Leave management and payroll features are out of scope  
• SQLite used for simplicity  
• Free hosting on Render may sleep after inactivity  
• Designed for internship/demo scale, not enterprise scale  

---

## 🎯 Notes

This project emphasizes:

• Clean code  
• Proper backend architecture  
• RESTful design  
• Usable UI  
• Realistic HR workflow  

The goal was to build a system that feels like a real internal company tool rather than a basic CRUD demo.

---

## 👨‍💻 Author

Built with ❤️ by **Ujju**
