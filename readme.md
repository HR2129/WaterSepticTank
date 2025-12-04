# 💧 Water Septic Tank Management System

<!-- badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/Database-OracleDB-orange" />
  <img src="https://img.shields.io/badge/Build-Vite-purple" />
  <img src="https://img.shields.io/badge/License-ISC-lightgrey" />
</p>

A complete **full‑stack application** for automating septic tank operations, enabling:
- Tank registration & citizen services  
- Inspection → Job assignment → Cleaning execution  
- Billing, receipts & PDF document generation  
- Full admin management (masters, configurations, dashboards)  

---

# 📚 Table of Contents
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Overview](#system-overview)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Project Structure](#project-structure)
- [System Flow](#system-flow)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

# 🚀 Key Features

## 🔐 Authentication & Security
- JWT-based Admin & Citizen authentication  
- Protected routes (frontend + backend)  
- Encrypted tokens using **CryptoJS**  
- Secure file upload with **Multer**  

## 🗂️ Master Data Management
CRUD operations for:
- Tank Types  
- Ownership Types  
- Contractors  
- Staff  
- Rate Configurations  

Includes:
- Table views  
- Search & filtering  
- Excel/CSV export  
- Formik + Yup validation  

## ⚙️ Configuration Management
Admins can configure:
- Tank type rules  
- Contractor & staff mapping  
- System metadata  

## 🔄 Transaction Processing  
### Workflow:
1. **Inspection Assignment**  
2. **Job Assignment**  
3. **Cleaning Execution** (photo upload)  
4. **Bill Generation (PDF)**  
5. **Receipt Collection**  

## 👨‍💻 Citizen Portal Features
- Tank registration  
- Application tracking  
- Bill viewing & payments  
- Downloadable certificates & receipts  

## 🌐 Multi‑Language Support
- English  
- Marathi  

Powered by JSON translation + Context API.

## 📊 Dashboard & Analytics
- Dynamic department dashboards  
- API‑powered stats  
- Lazy-loaded submodule dashboards  

## 📝 Logging & Error Tracking
- Backend: Winston logs with daily rotation  
- Frontend: Sends error metadata to backend  

---

# 🛠️ Tech Stack

## 🎨 Frontend
| Technology | Purpose |
|-----------|----------|
| React 19 | UI framework |
| Vite 6 | Lightning-fast build tool |
| React Router DOM | Routing |
| Tailwind CSS + Bootstrap | Styling |
| Formik + Yup | Form validation |
| Axios | API client |
| Radix UI | UI components |
| jsPDF + html2canvas | PDF generation |
| Recharts / Chart.js | Charts |
| SweetAlert2 | Alerts |

## 🖥️ Backend
| Technology | Purpose |
|-----------|----------|
| Node.js + Express | API server |
| OracleDB | Database |
| JWT | Authentication |
| Multer | File uploads |
| Puppeteer | PDF creation |
| Handlebars | Document templates |
| Winston | Logging |

---

# 🧩 System Overview

## Frontend Highlights
- Admin + Citizen portals  
- Context-driven state management  
- Form validations  
- Protected routing  
- Excel/PDF export  

## Backend Highlights
- Node.js REST APIs  
- OracleDB CRUD operations  
- File/document storage  
- PDF generation workflow  
- Transaction pipelines  

---

# ⚛️ Frontend Setup

```bash
cd Water_Frontend
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Water Septic Tank Management
```

Run:
```bash
npm run dev
```

---

# 🖥️ Backend Setup

```bash
cd Water_Backend
npm install
```

Create `.env`:

```
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE_NAME=orcl
JWT_SECRET=your_secret
SESSION_SECRET=your_session_secret
PORT=5000
```

Run:
```bash
node server.js
```

---

# 📁 Project Structure

## 🌐 Frontend
```
Water_Frontend/
├── src/
│   ├── Components/
│   ├── Context/
│   ├── HOC/
│   ├── Hooks/
│   ├── Pages/
│   ├── Translations/
│   ├── utils/
│   ├── lib/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
├── public/
└── vite.config.js
```

## ⚙️ Backend
```
Water_Backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── templates/
├── uploads/
├── generated_files/
├── logs/
└── server.js
```

---

# 🔄 System Flow

## 🔐 Authentication
```
User Login → Backend Validation → JWT Token → Frontend LocalStorage → Protected Route Access
```

## 🗂️ Master Data Flow
```
Fetch Data → Display Table → CRUD → Validate → Save in OracleDB → Refresh UI
```

## 🛠️ Transaction Pipeline
```
Inspection → Job Assignment → Cleaning Execution → Bill PDF → Receipt
```

## 👨‍💻 Citizen Journey
```
Login → Dashboard → Tank Registration → Track Status → Pay Bill → Download Certificates
```

---

# 🧪 API Overview

## 🔐 Authentication
```
POST /admin/login
POST /citizen/login
POST /logout
```

## 🗂️ Masters
```
GET/POST/PUT/DELETE /tank-types
GET/POST/PUT/DELETE /contractors
GET/POST/PUT/DELETE /staff
GET/POST/PUT/DELETE /rate-config
```

## 🔄 Workflow
```
POST /assign-inspection
POST /job-assign
POST /cleaning-execution
POST /bill-generation
POST /receipt-collection
```

## 👤 Citizen
```
POST /citizen/register
GET /citizen/applications
GET /citizen/bills
```

---

# 🤝 Contributing
1. Fork the repo  
2. Create a feature branch  
3. Commit changes  
4. Submit PR  

---

# 📝 License
Licensed under the **ISC License**.

---

# 📬 Contact
For support:  
📧 dubeyrishi2002@gmail.com

