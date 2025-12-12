# Ticket Booking System - Backend API

Node.js/Express backend API for the ticket booking system supporting movies, bus trips, and doctor appointments.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure database in `.env` file

3. Create database tables:
```bash
mysql -u root -p < schema.sql
```

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show details
- `POST /api/shows` - Create show (admin)
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking
