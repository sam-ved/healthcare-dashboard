# Growth Catalysts Healthcare Hub - Role-Based Hospital Management System

A comprehensive, role-based hospital management system built with Vue 3, TypeScript, Express, PostgreSQL, and Prisma ORM.

## 🚀 Features

### Authentication & Role-Based Access
- Secure employee login with EmployeeID and Password
- Automatic role-based redirection:
  - **DOCTOR** → `/doctor/dashboard`
  - **NURSE/WARDBOY** → `/reception/dashboard`
  - **ADMIN** → `/admin/analytics`
- Protected routes with Vue Router navigation guards

### 🏥 Reception/Nurse Portal (`/reception`)
- **Triage Dashboard**: Real-time stats for active patients, available doctors, and ICU occupancy
- **Patient Entry Workflow**:
  - **New Patient**: Complete registration with demographics, medical history, and auto-generated PID
  - **Returning Patient**: Search by PID or phone, view history, create new visits
- **Ward Management**: Visual management of bed assignments and ward allocation

### 👨‍⚕️ Doctor Portal (`/doctor`)
- **Patient Queue**: View all patients awaiting examination or admitted
- **Patient Examiner**: Full medical history timeline and examination interface
- **Action Console**:
  - **Prescribe**: Add prescription and discharge patient
  - **Admit**: Assign to ward (GENERAL, ICU, PRIVATE)
  - **Schedule Surgery**: Date/time picker with automatic status updates and notifications

### 📊 Admin Dashboard (`/admin`)
- **Analytics**: 7-day patient inflow with visual charts
- **Disease Heatmap**: Top 5 diagnosed diseases
- **Staff Status**: Real-time availability monitoring

### 💎 UI/UX Features
- **Collapsible Professional Sidebar**: Role-specific navigation items
- **Status Badges**: Color-coded for ADMITTED, DISCHARGED, SURGERY, etc.
- **Empty States**: Friendly messages when no data is available
- **Loading States**: All buttons show loading indicators to prevent double-clicks
- **Responsive Design**: Mobile-first Tailwind CSS with gradient accents

## 🛠️ Tech Stack

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Vue Router 4
- Tailwind CSS
- Lucide Icons (vue-next)
- Vite

**Backend:**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- bcryptjs (password hashing)
- JWT authentication

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Docker (optional, for database)

### Backend Setup

1. Navigate to backend directory:
```bash
cd healthcare-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthcare_db"
JWT_SECRET="your-secret-key-here"
PORT=3000
```

4. Initialize database:
```bash
npx prisma db push
```

5. Seed the database:
```bash
npx prisma db seed
```

6. Start the server:
```bash
npm run dev
```

The API will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd healthcare-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 🔐 Demo Credentials

| Role | Employee ID | Password |
|------|-------------|----------|
| Doctor (Cardiology) | DOC-CARDIO-01 | password123 |
| Doctor (Orthopedics) | DOC-ORTHO-01 | password123 |
| Nurse | NURSE-01 | password123 |
| Nurse | NURSE-02 | password123 |
| Wardboy | WARDBOY-01 | password123 |
| Admin | ADMIN-001 | password123 |

## 📁 Project Structure

```
healthcare-dashboard/
├── healthcare-backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed.ts                # Seed data
│   └── src/
│       ├── controllers/           # Request handlers
│       ├── routes/                # API routes
│       ├── services/              # Business logic
│       ├── middlewares/           # Auth, validation
│       ├── utils/                 # JWT, helpers
│       └── config/                # Prisma, env
│
└── healthcare-frontend/
    └── src/
        ├── router/                # Vue Router config
        ├── views/                 # Page components
        │   ├── doctor/
        │   ├── reception/
        │   └── admin/
        ├── layouts/               # Layout wrappers
        ├── components/            # Reusable UI
        ├── utils/                 # Auth helpers
        └── types.ts               # TypeScript types
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/employee-login` - Employee login

### Patients
- `GET /patients` - List all patients
- `GET /patients/:id` - Get patient with visits
- `GET /patients/search?q=` - Search by PID or phone
- `POST /patients` - Create new patient
- `DELETE /patients/:id` - Delete patient

### Visits
- `GET /visits/doctor/:doctorId` - Get doctor's queue
- `POST /visits` - Create new visit
- `PUT /visits/:id` - Update visit (status, prescription, ward)

### Surgeries
- `POST /surgeries` - Schedule surgery
- `GET /surgeries` - List all surgeries

### Statistics
- `GET /stats/triage` - Triage dashboard stats
- `GET /stats/analytics` - Admin analytics data

## 🎨 Design System

**Color Palette:**
- Primary: Indigo (600-700)
- Success: Emerald
- Warning: Amber
- Error: Rose
- Info: Blue

**Status Colors:**
- **ADMITTED**: Amber/Yellow
- **DISCHARGED**: Emerald/Green
- **SURGERY_SCHEDULED / IN_SURGERY**: Rose/Red
- **CHECKUP_PENDING**: Blue
- **UNDER_OBSERVATION**: Purple

## 🚧 Development Notes

- All API calls should go through the `@/api.ts` service
- Authentication tokens are stored in `localStorage`
- Route guards automatically redirect unauthorized users
- Patient forms include real-time validation
- All modals and forms show loading states

## 📝 Future Enhancements

- Real SMS notifications via Twilio/AWS SNS
- Email notifications for surgery schedules
- Appointment booking system
- Prescription printing
- Medical report uploads
- Lab test integration
- Billing and insurance management

## 👥 Team

Growth Catalysts Healthcare Hub Development Team

## 📄 License

Proprietary - Growth Catalysts

---

**Built with ❤️ for better healthcare management**
