# Ticket Booking System - Frontend

A modern, responsive React.js frontend for a comprehensive Ticket Booking System supporting movies, bus bookings, and doctor appointments.

## Tech Stack

- **Framework**: React.js 19.2.3
- **Language**: TypeScript 4.9.5
- **State Management**: Context API
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4.1.18
- **HTTP Client**: Axios 1.13.2
- **Build Tool**: Create React App with Craco

## Features

### Admin Features
- ✅ Create new shows/trips/slots with name, start time, and seat count
- ✅ View list of all shows with real-time availability
- ✅ Support for multiple show types (Movie, Bus, Doctor Appointment)
- ✅ Dashboard with seat management

### User Features
- ✅ Browse available shows/trips/slots
- ✅ Visual seat selection grid with real-time status updates
- ✅ Book one or multiple seats in one transaction
- ✅ Real-time booking status tracking (PENDING, CONFIRMED, FAILED)
- ✅ View booking history with details
- ✅ Responsive design for mobile and desktop

### Core Features
- ✅ Role-based authentication (Admin/User)
- ✅ JWT token-based authorization
- ✅ Error handling and user-friendly error messages
- ✅ Loading states and empty state messages
- ✅ Form validation with error feedback
- ✅ Real-time seat availability updates
- ✅ Error boundary for graceful error handling

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create a `.env` file:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Default Demo Accounts

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # Global state management
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API client services
├── types/           # TypeScript interfaces
└── App.tsx          # Main app component
```

## Key Features Implementation

### Authentication
- JWT-based authentication with localStorage persistence
- Protected routes based on user role
- Automatic logout on 401 errors

### State Management
- Context API for global auth and user state
- Local state for component-specific data
- Custom useForm hook for form management

### Error Handling
- Axios interceptors for global error handling
- Component-level error boundaries
- User-friendly error messages

### API Integration
- Centralized axios instance with auth interceptors
- Automatic token injection in requests
- Error standardization

## Assumptions Made

1. Backend API running on configured URL
2. JWT tokens in Authorization header
3. Pre-created demo accounts in database
4. Polling for real-time booking status
5. Server provides real-time seat availability

## Known Limitations

1. Uses polling instead of WebSocket for real-time updates
2. JWT stored in localStorage (not httpOnly)
3. No offline capability
4. No image upload support
5. No email notifications

## Available Scripts

```bash
npm start          # Start development server
npm run dev        # Same as start
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from CRA (irreversible)
```

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload build folder to Netlify
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
```bash
PORT=3001 npm start
```

### API Connection Issues
- Verify backend is running
- Check `REACT_APP_API_BASE_URL` in .env
- Check browser console for CORS errors

### Login Not Working
- Verify demo accounts exist in backend
- Check localStorage for token
- Verify JWT secret match

## License

Part of Ticket Booking System educational project

---

**Last Updated**: December 12, 2025
**Version**: 1.0.0
