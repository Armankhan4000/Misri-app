# Mistri Admin Dashboard

A modern, professional admin dashboard for a service marketplace platform built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### Authentication
- Admin login with JWT support
- Role-based access control (Super Admin, Admin, Moderator)
- Protected routes

### Dashboard
- Overview with key metrics
- Analytics charts
- Real-time statistics

### Management Modules
- Customer Management
- Technician Management
- Booking Management
- Advertisement Management
- Offers & Promotions
- Commission Management
- Notifications
- Analytics
- Settings

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## Installation

```bash
cd admin-dashboard
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── services/         # API services
├── store/            # Zustand stores
├── types/            # TypeScript types
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
└── App.tsx           # Main app component
```

## Environment Variables

Copy `.env.example` to `.env.local` and update values:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Mistri Admin Dashboard
```

## License

MIT
