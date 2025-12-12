# Ticket Booking System

A comprehensive ticket booking system supporting movies, bus trips, and doctor appointments with real-time seat booking and concurrency handling.

## Features

### Backend (Node.js + Express + PostgreSQL)
- **Authentication**: JWT-based auth with role-based access (Admin/User)
- **Show Management**: Create and manage shows/trips/appointments
- **Seat Booking**: Real-time seat selection with concurrency control
- **Booking States**: PENDING → CONFIRMED/FAILED with automatic expiry
- **Concurrency Handling**: Database transactions and row locking to prevent overbooking

### Frontend (React + TypeScript + Tailwind CSS)
- **Admin Dashboard**: Create shows, view all bookings
- **User Dashboard**: Browse available shows, view booking history
- **Seat Selection**: Visual seat layout with real-time status updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcryptjs
- **Frontend**: React, TypeScript, Tailwind CSS, Axios, React Router
- **Database**: PostgreSQL with connection pooling
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## Architecture

### System Design
- **Microservices-like structure** with separate concerns
- **Database transactions** for atomic seat booking operations
- **Background job** for cleaning expired bookings every 30 seconds
- **RESTful API** with proper error handling and validation

### Concurrency Control
- **Row-level locking** on shows and seats during booking
- **Pessimistic locking** to prevent race conditions
- **Automatic expiry** of pending bookings (2 minutes)
- **Status tracking** with PENDING/CONFIRMED/FAILED states

### Scalability Considerations
- **Database sharding** by show_id for large-scale deployments
- **Read replicas** for show listings and seat availability
- **Redis caching** for frequently accessed show data
- **Message queues** for async booking confirmations

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd ticket-booking-system/backend
   npm install
   ```

2. **Environment Variables**
   Create `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/ticket_booking
   JWT_SECRET=your_super_secret_jwt_key_change_this
   ALLOWED_ORIGIN=http://localhost:3000
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb ticket_booking

   # Run schema setup
   node setup.js
   ```

4. **Start Backend**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ticket-booking-system/frontend
   npm install
   ```

2. **Environment Variables**
   Create `.env` file:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=Ticket Booking System
   ```

3. **Start Frontend**
   ```bash
   npm start
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Shows (Admin only)
- `POST /api/shows` - Create new show/trip
- `GET /api/shows` - Get all shows (public)
- `GET /api/shows/:id` - Get show details with seats

### Bookings
- `POST /api/bookings` - Book seats
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking status

## Demo Accounts

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Deployment

### Backend Deployment (Railway/Render)

1. **Prepare Backend for Deployment**
   ```bash
   cd backend
   # Update .env with production database URL
   # DATABASE_URL=postgresql://user:pass@host:5432/db
   # JWT_SECRET=your_production_secret
   # ALLOWED_ORIGIN=https://your-frontend-domain.vercel.app
   ```

2. **Deploy to Railway/Render**
   - Push code to GitHub
   - Connect repository to Railway/Render
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `ALLOWED_ORIGIN`
     - `NODE_ENV=production`
   - Deploy

3. **Initialize Database**
   ```bash
   # Run setup script on your deployed backend
   curl https://your-backend-url.com/setup-db
   ```

### Frontend Deployment (Vercel)

1. **Prepare Frontend for Deployment**
   ```bash
   cd frontend
   # Update .env.production
   REACT_APP_API_BASE_URL=https://your-backend-url.com/api
   ```

2. **Deploy to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set build settings:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`
   - Set environment variables:
     - `REACT_APP_API_BASE_URL`
   - Deploy

### Alternative: Manual Deployment

**Backend:**
```bash
# On your server
git clone <repository>
cd backend
npm install
npm run setup-db  # If you add this script
npm start
```

**Frontend:**
```bash
# On your server or locally
cd frontend
npm install
npm run build
# Serve build/ directory with nginx/apache
```

## Project Structure

```
ticket-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/ (empty - using raw SQL)
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── schema.sql
│   ├── setup.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Key Technical Decisions

1. **PostgreSQL over MongoDB**: ACID compliance crucial for financial transactions like bookings
2. **Row-level locking**: Prevents overbooking in high-concurrency scenarios
3. **JWT with expiration**: Stateless authentication with automatic logout
4. **React Context**: Simple state management for auth and app state
5. **Tailwind CSS**: Rapid UI development with consistent design system

## Future Enhancements

- Email/SMS notifications for booking confirmations
- Payment gateway integration
- Real-time seat updates with WebSockets
- Advanced search and filtering
- Mobile app development
- Multi-tenant support for different organizations

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - feel free to use this project for learning and development purposes.
"# ticket-book" 
