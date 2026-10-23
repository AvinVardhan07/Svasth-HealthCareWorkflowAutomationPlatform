# SVASTH: Healthcare Operations & Workflow Automation Platform
## Complete Technical Specification & Comprehensive Project Documentation

---

## 1. Executive Summary & Vision

**SVASTH** (derived from Sanskrit for health and well-being) is an enterprise-grade digital healthcare workflow automation and patient engagement platform. Built with a modern micro-services-inspired Monorepo architecture, SVASTH seamlessly unites patients, clinical reception staff, healthcare providers (doctors), and hospital administrators into a single, cohesive, real-time clinical command center.

### Core Objectives
- **Automated Patient Lifecycle Management**: Eliminate manual record-keeping by seamlessly guiding patients from initial consultation booking to real-time QR code check-in, doctor consultation, and post-visit follow-up.
- **Multi-Channel Automated Communication**: Utilize event-driven pub/sub architecture and webhook automation (via Redis and n8n) to trigger instant WhatsApp confirmations, email notifications, and automated appointment reminders.
- **Intelligent Front-Desk Orchestration**: Provide reception desk personnel with a touchless QR code scanning verification mechanism that accelerates queue flow and eliminates patient wait times.
- **Embedded Conversational AI Assistant**: Offer an interactive 24/7 AI virtual assistant directly within the patient dashboard to assist with scheduling queries, check-in instructions, and hospital protocols.

---

## 2. System Architecture & High-Level Flow

SVASTH adopts a full-stack JavaScript/Node.js architecture utilizing React 18 for the frontend client and Express.js for the RESTful API backend, supported by MongoDB for persistent document storage and Redis for caching & event stream dispatching.

### Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +-------------------+  +-------------------+  +------------------+  +---------+  |
|  | Patient Dashboard |  | Reception Desk    |  | Doctor Workspace |  | Admin   |  |
|  | & AI Assistant    |  | (QR Check-in)     |  | (Consultations)  |  | Portal  |  |
|  +---------+---------+  +---------+---------+  +--------+---------+  +----+----+  |
+------------|----------------------|---------------------|-----------------|-------+
             |                      |                     |                 |
             +----------------------+---------+-----------+-----------------+
                                              | HTTP REST / JSON API (Port 5000)
                                              v
+-----------------------------------------------------------------------------------+
|                                  BACKEND LAYER                                    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Node.js / Express.js REST API Server (src/app.js)                           |  |
|  |  - Auth Routes (/api/login, /api/register, /api/forgot-password)            |  |
|  |  - Doctor Routes (/api/doctors)                                             |  |
|  |  - Appointment Routes (/api/appointments, /checkin, /complete)              |  |
|  |  - Notification Routes (/api/notifications)                                 |  |
|  |  - Queue & Stats Routes (/api/queue, /api/stats)                            |  |
|  |  - SVASTH AI Assistant Endpoint (/api/assistant)                            |  |
|  +-------------------+-----------------------------+---------------------------+  |
|                      |                             |                              |
|                      v                             v                              |
|       +------------------------------+  +------------------------------+          |
|       | MongoDB Storage (Port 27017) |  | Redis Event Engine (Port 6379)|          |
|       |  - Users Collection          |  |  - LRU Doctor Cache          |          |
|       |  - Doctors Collection        |  |  - Event Pub/Sub Stream      |          |
|       |  - Appointments Collection   |  +--------------+---------------+          |
|       |  - Notifications Collection  |                 |                          |
|       +------------------------------+                 v                          |
|                                         +------------------------------+          |
|                                         | External Webhook (n8n Engine)|          |
|                                         |  - WhatsApp API Trigger      |          |
|                                         |  - Email Notification Engine |          |
|                                         +------------------------------+          |
+-----------------------------------------------------------------------------------+
```

---

## 3. Technology Stack & Key Dependencies

### 3.1 Frontend Framework & Libraries
- **Framework**: React 18 (`react`, `react-dom`) initialized with **Vite 5**.
- **Routing**: `react-router-dom` (v6.21) supporting client-side routing, protected routes, and role-based redirects.
- **Styling**: Vanilla CSS + Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`).
- **UI Animation**: `framer-motion` (v11.11) for smooth entrance transitions, page feel, and hero section dynamics.
- **Icons**: `lucide-react` (v1.23) for clean modern icons.
- **QR Code Generation**: `qrcode.react` (v4.0) rendering SVG vector QR codes (`QRCodeSVG`) for high-contrast scan reliability.

### 3.2 Backend Framework & Services
- **Runtime & Framework**: Node.js ES Modules (`"type": "module"`) running Express.js (`express` v4.21).
- **Database Driver**: Official Node MongoDB Driver (`mongodb` v7.4) with manual indexing and ObjectId handling.
- **Cache & Event Bus**: `ioredis` (v5.3) for key-value memory caching and event publishing.
- **Cross-Origin Handling**: `cors` (v2.8) for domain cross-origin communication.
- **Environment Management**: `dotenv` (v16.0) for environment variable injection.
- **Process Orchestration**: `concurrently` (v9.0) enabling single-command execution of client and server dev environments.

---

## 4. Repository & File Structure Breakdown

```
Svasth-Project/
├── package.json                   # Root package configuration with workspaces & concurrently scripts
├── package-lock.json              # Dependency tree lock file
├── README.md                      # Quick-start documentation
├── .env.example                   # Master environment template
│
├── backend/                       # Express.js REST API Backend
│   ├── .env                       # Active environment variables (Port 5000, Mongo URI, Redis URL)
│   ├── .env.example               # Backend configu7ration blueprint
│   ├── .gitignore                 # Backend-specific ignore list
│   ├── package.json               # Backend dependencies and ES module script declarations
│   ├── mongo.js                   # Standalone database connectivity script
│   ├── server.js                  # Express entry point wrapper
│   └── src/
│       ├── index.js               # Primary execution module importing app.js
│       ├── app.js                 # Complete Express application configuration, API routes & logic
│       ├── config/
│       │   ├── database.js        # MongoDB connection pooling & schema index initialization
│       │   └── redis.js           # Redis client with retry strategies, error logging, & webhook dispatcher
│       └── services/
│           ├── notifications.js   # Notification creation & retrieval service
│           └── seed.js            # Initial database seeder for doctors and default demo user
│
└── frontend/                      # React 18 + Vite Frontend App
    ├── .env                       # Frontend active environment variables (VITE_API_BASE_URL)
    ├── .env.example               # Frontend configuration template
    ├── index.html                 # HTML5 entry document with viewport meta tags
    ├── package.json               # Frontend dependencies (React, Vite, Framer Motion, Lucide, QR Code)
    ├── vite.config.js             # Vite configuration with React plugin and proxy settings
    ├── dist/                      # Production build distribution directory
    └── src/
        ├── main.jsx               # React DOM root render file wrapped in BrowserRouter
        ├── index.css              # Global styles and Tailwind CSS directives
        ├── App.jsx                # Unified multi-page single-file component containing all views & state
        └── assets/
            └── Svasth-logo.png    # Official SVASTH platform branding logo
```

---

## 5. Database Schemas & Data Models

SVASTH uses MongoDB database named `svasth` with four primary collections:

### 5.1 `users` Collection
Stores user account profiles for patients and clinical personnel.

| Field | Type | Description | Index / Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated MongoDB primary key | Primary Key |
| `name` | String | User's full name | Required |
| `email` | String | User's email address | **Unique Index** |
| `password` | String | Hashed account credential | Required |
| `phone` | String | Contact telephone number | Optional |
| `role` | String | System access role (`patient`, `doctor`, `reception`, `admin`) | Default: `'patient'` |
| `createdAt` | ISO Date String | Account creation timestamp | System-generated |

### 5.2 `doctors` Collection
Contains medical provider directory data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Mongo primary identifier |
| `id` | Number | Numeric doctor identifier (e.g. 1, 2, 3) |
| `name` | String | Full professional title & name (e.g. "Dr. Asha Rao") |
| `specialty` | String | Medical domain (e.g. "Cardiology", "Neurology", "Pediatrics") |
| `experience` | String | Years of clinical experience |
| `availability` | String | Human-readable schedule availability |
| `location` | String | Hospital wing / OPD room location |
| `consultationType` | String | Modes of care (e.g. "In-person + Video") |

### 5.3 `appointments` Collection
Core transactional document managing patient appointments.

| Field | Type | Description | Index / Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary MongoDB identifier | Primary Key |
| `doctorId` | Number / String | Target doctor's numeric identifier | Required |
| `doctorName` | String | Denormalized doctor name for display speed | Required |
| `patientName` | String | Name of the patient receiving care | Required |
| `patientEmail` | String | Email address of patient | Required |
| `patientPhone` | String | Contact phone number for notifications | Optional |
| `date` | String | YYYY-MM-DD appointment date | Required |
| `slot` | String | Time slot (e.g. "09:00 AM", "02:00 PM") | Required |
| `reason` | String | Chief complaint / purpose of visit | Required |
| `status` | String | Workflow status: `'confirmed'`, `'checked-in'`, `'completed'` | Required |
| `qrCode` | String | Unique scan identifier format `SVASTH-XXXXXX` | **Sparse Unique Index** |
| `reminderStatus` | String | Status of automated reminder (`scheduled`, `sent`) | Default: `'scheduled'` |
| `createdAt` | ISO Date String | Creation timestamp | System-generated |

### 5.4 `notifications` Collection
Stores persistent audit logs and user activity updates.

| Field | Type | Description | Index / Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary MongoDB identifier | Primary Key |
| `email` | String | Associated user email | Required |
| `message` | String | Human-readable notification content | Required |
| `createdAt` | ISO Date String | Creation timestamp | **Index: Descending (-1)** |

---

## 6. Complete API Reference

Base URL: `http://localhost:5000`

### 6.1 System Health
- **GET `/api/health`**
  - **Description**: Verifies backend server operation and database connectivity.
  - **Response `200 OK`**:
    ```json
    {
      "status": "ok",
      "message": "SVASTH backend is running and MongoDB is connected"
    }
    ```

### 6.2 Authentication API
- **POST `/api/register`**
  - **Description**: Registers a new user account, initializes notifications, and pushes `user.registered` event to Redis.
  - **Request Body**:
    ```json
    {
      "name": "Aditi Sharma",
      "email": "aditi@example.com",
      "password": "password123",
      "phone": "9876543210"
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "user": {
        "_id": "66dba123...",
        "name": "Aditi Sharma",
        "email": "aditi@example.com",
        "phone": "9876543210",
        "role": "patient",
        "createdAt": "2026-09-06T16:00:00.000Z"
      }
    }
    ```

- **POST `/api/login`**
  - **Description**: Authenticates user against email and password credentials. Pushes `user.login` event.
  - **Request Body**:
    ```json
    {
      "email": "aditi@example.com",
      "password": "password123"
    }
    ```
  - **Response `200 OK`**: Returns user profile object.

- **POST `/api/forgot-password`**
  - **Description**: Generates a temporary reset security code for password recovery.
  - **Request Body**: `{ "email": "aditi@example.com" }`
  - **Response `200 OK`**: `{ "message": "Temporary reset code generated: SVASTH-A1B2C3" }`

### 6.3 Doctors Directory API
- **GET `/api/doctors`**
  - **Description**: Returns list of all doctors. Results are cached in Redis for 1 hour (`60*60` seconds) for optimal speed.
  - **Response `200 OK`**: Array of doctor objects.

### 6.4 Appointments API
- **GET `/api/appointments`**
  - **Query Parameters**: `?email=user@example.com` (Optional)
  - **Description**: Retrieves appointments, filtered by email if specified, ordered newest first.

- **POST `/api/appointments`**
  - **Description**: Creates a new appointment, generates a unique QR code (`SVASTH-XXXXXX`), triggers notifications across Email/WhatsApp channels, and pushes `appointment.created` event.
  - **Request Body**:
    ```json
    {
      "doctorId": "1",
      "patientName": "Aditi Sharma",
      "patientEmail": "aditi@example.com",
      "patientPhone": "9876543210",
      "date": "2026-09-10",
      "slot": "11:30 AM",
      "reason": "Routine Cardiology Consultation"
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "success": true,
      "message": "Appointment booked successfully and confirmation sent.",
      "appointment": { ... },
      "qrCode": "SVASTH-7X9K2M",
      "confirmation": { "email": "aditi@example.com", "whatsapp": "9876543210" }
    }
    ```

- **POST `/api/appointments/:id/checkin`**
  - **Description**: Updates appointment status from `confirmed` to `checked-in`. Triggers arrival notification and publishes `appointment.checkedin` event.

- **POST `/api/appointments/:id/complete`**
  - **Description**: Updates status to `completed`. Marks consultation finished and publishes `appointment.completed` event.

### 6.5 Queue & Analytics API
- **GET `/api/notifications`**
  - **Query Parameters**: `?email=user@example.com`
  - **Description**: Returns notifications ordered by newest timestamp.

- **GET `/api/queue`**
  - **Description**: Fetches live active patient queue (all non-completed appointments).

- **GET `/api/stats`**
  - **Description**: Aggregates clinic operational metrics (`totalAppointments`, `confirmed`, `completed`).

### 6.6 SVASTH AI Virtual Assistant API
- **POST `/api/assistant`**
  - **Description**: Rules-assisted intent processing endpoint assisting patients with appointment instructions, QR verification steps, and reminder status.
  - **Request Body**: `{ "message": "How do I check in with QR code?" }`
  - **Response `200 OK`**: `{ "reply": "Your QR code is generated after booking and can be used at the reception desk." }`

---

## 7. Frontend User Experience & View Architecture

The frontend application (`src/App.jsx`) is built as a responsive Single Page Application (SPA) with 8 primary views:

1. **Home Page (`/`)**:
   - Modern hero section featuring SVASTH key statistics (40% faster scheduling, 60% reduced manual follow-up, 98% patient satisfaction).
   - Interactive feature breakdown: Platform Overview, Workflow Automation, Real-time Visibility, Data Privacy.
   - Dynamic navigation bar with responsive mobile slide-out menu.

2. **Authentication Pages (`/login`, `/register`)**:
   - Clean forms for single-click signup and login.
   - Persists session in `localStorage` (`svasth-user`).

3. **Forgot Password (`/forgot-password`)**:
   - Generates temporary security codes (`SVASTH-XXXXXX`) for account recovery.

4. **Patient Dashboard (`/dashboard`)**:
   - Overview metrics: Next upcoming appointment, QR readiness status, and notification count.
   - Interactive Doctor Search: Filter by name or medical specialty.
   - Appointment Booking Form: Live selection of doctors, dates, time slots, and medical reasons.
   - Interactive Appointment Cards: Renders SVG vector QR codes using `qrcode.react` for instant check-in.
   - Real-time Notifications Panel: Automatic polling every 5 seconds (`setInterval`) to ensure instant state sync.

5. **Reception Desk (`/reception`)**:
   - Instant QR code reader input field.
   - One-click verification and check-in confirmation.
   - Real-time waiting room queue display.

6. **Doctor Workspace (`/doctor`)**:
   - Clinical queue view showing patient name, visit reason, date, and time.
   - Single-tap button to mark consultations completed.

7. **Admin Dashboard (`/admin`)**:
   - High-level metric summary cards (Total, Confirmed, Completed).
   - Global clinical operations table with complete control over appointment statuses.

8. **SVASTH AI Assistant Drawer**:
   - Floating widget present in patient view for instant guidance.

---

## 8. Workflow Automation & Integration Architecture

SVASTH implements an event-driven pub/sub architecture to connect database mutations with external communications:

```
[ Express API Action ]
         |
         v
  pushEvent(type, payload)
         |
         +----> Redis LPUSH 'events' (Persistent log)
         |
         +----> Redis PUBLISH 'events' (Real-time Pub/Sub subscribers)
         |
         +----> HTTP POST (External n8n Webhook URL)
                     |
                     +---> n8n Workflow Automation Engine
                                |
                                +---> Send WhatsApp Confirmation Message
                                +---> Send Automated Email Reminder
                                +---> Update Third-party CRM / EHR
```

---

## 9. Installation, Configuration & Local Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)
- *(Optional)* **Redis Server**: Running locally on `redis://127.0.0.1:6379` (If unavailable, SVASTH automatically operates gracefully using local fallbacks).

### Step 1: Clone & Install Dependencies
Run in project root:
```bash
npm install
```

### Step 2: Configure Environment Files

**Root `.env`**:
```env
MONGO_URI=mongodb://127.0.0.1:27017
PORT=5000
REDIS_URL=redis://127.0.0.1:6379
```

**Backend `backend/.env`**:
```env
MONGO_URI=mongodb://127.0.0.1:27017
PORT=5000
REDIS_URL=redis://127.0.0.1:6379
N8N_WEBHOOK_URL=
```

**Frontend `frontend/.env`**:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Step 3: Run Development Server
Execute from the project root:
```bash
npm run dev
```
This runs `concurrently`, firing up both servers:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 10. Summary & Conclusion

SVASTH represents a comprehensive, production-ready Healthcare Operations Platform combining elegant UI design with robust backend automation. By reducing front-desk wait times, automating reminders, providing clear provider visibility, and offering embedded AI assistance, SVASTH sets a high standard for modern healthcare software.

---
*Documentation compiled for SVASTH Platform (v1.0.0).*
