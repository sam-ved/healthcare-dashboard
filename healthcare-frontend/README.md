# Healthcare Patient Enrollment System

**Growth Catalysts** — Professional Patient Management Dashboard built with Vue 3 + Tailwind CSS.

## Overview

A single-screen Vue 3 application for managing patient enrollment, admissions, and discharge records with real-time statistics.

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite (Rolldown)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide Vue Next
- **Deployment**: Docker (Nginx)

## Features

### 1. Patient Enrollment Form

- Mandatory fields: Name, Age, Health Issue, Issue Since
- Real-time validation with error messages
- Clear form after successful submission

### 2. Real-time Statistics

- **Total Patients**: Count of all enrolled records
- **Currently Admitted**: Count of active admissions
- **Successfully Discharged**: Count of completed treatments

### 3. Patient Records Table

- Display all enrolled patients with status
- Discharge action for admitted patients
- Undo action for discharged patients
- Status badges: Blue (Admitted) | Green (Discharged)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker (optional, for containerization)

### Local Development

```bash
cd healthcare-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## Docker Deployment

### Build Image

```bash
docker build -t healthcare-dashboard:latest .
```

### Run Container

```bash
docker run --rm -p 8080:80 healthcare-dashboard:latest
```

Open [http://localhost:8080](http://localhost:8080)

## Project Structure

healthcare-dashboard/
├── src/
│   ├── App.vue              # Main single-screen application
│   ├── main.js              # Vue app entry point
│   ├── style.css            # Global styles + Tailwind
│   └── assets/              # (minimal, optimized)
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── Dockerfile               # Docker build recipe
├── nginx.conf               # Nginx SPA routing config
└── .dockerignore            # Docker build context optimization

## Design System

- **Primary Color**: Indigo-600
- **Secondary Color**: Blue-600, Emerald-600
- **Background**: Slate-50
- **Typography**: Inter font family
- **Border Radius**: Rounded-lg, Rounded-xl
- **Spacing**: Tailwind default scale

## Scripts

- `npm run dev` — Start development server (Vite)
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

## Code Quality

- Vue 3 Composition API best practices
- Reactive state management with `ref` and `computed`
- Client-side form validation
- Tailwind CSS for responsive, utility-first styling
- Semantic HTML structure
- Accessibility-friendly UI components

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Growth Catalysts © 2026
