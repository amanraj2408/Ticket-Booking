# Ticket Booking System - System Design Document

## Overview

This document outlines the system architecture and design decisions for a scalable ticket booking system that handles high concurrency scenarios for movie tickets, bus trips, and doctor appointments.

## High-Level Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   API Gateway   │    │  Booking Engine │
│   (React)       │◄──►│   (Express)     │◄──►│  (Node.js)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │   (Primary)     │
                    └─────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
           ┌────────▼────────┐ ┌──────▼──────┐
           │   Read Replica  │ │   Redis      │
           │   (PostgreSQL)  │ │   Cache      │
           └─────────────────┘ └─────────────┘
```

### Component Descriptions

1. **Web Frontend**: React-based SPA handling user interactions
2. **API Gateway**: Express.js server managing authentication and routing
3. **Booking Engine**: Core business logic for seat booking and concurrency
4. **Primary Database**: PostgreSQL handling transactional data
5. **Read Replicas**: PostgreSQL instances for read-heavy operations
6. **Redis Cache**: In-memory cache for frequently accessed data

## Database Design

### Core Tables

#### Shows Table
```sql
CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  show_type VARCHAR(50) NOT NULL, -- 'movie', 'bus', 'doctor'
  start_time TIMESTAMP NOT NULL,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_shows_start_time ON shows(start_time);
CREATE INDEX idx_shows_type ON shows(show_type);
```

#### Seats Table
```sql
CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(show_id, seat_number)
);

-- Indexes
CREATE INDEX idx_seats_show_id ON seats(show_id);
CREATE INDEX idx_seats_status ON seats(status);
CREATE INDEX idx_seats_locked_until ON seats(locked_until);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
  seat_ids TEXT[] NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  expires_at TIMESTAMP NULL,
  confirmed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_show_id ON bookings(show_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_expires_at ON bookings(expires_at);
```

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Concurrency Control Mechanisms

### 1. Pessimistic Locking Strategy

**Booking Process:**
1. Begin transaction
2. Lock show row with `SELECT ... FOR UPDATE`
3. Lock selected seats with `SELECT ... FOR UPDATE`
4. Validate seat availability
5. Create pending booking
6. Temporarily lock seats (status = 'locked')
7. Commit transaction
8. Schedule automatic confirmation (after 1 second simulation)

**SQL Example:**
```sql
BEGIN;

-- Lock the show
SELECT * FROM shows WHERE id = $1 FOR UPDATE;

-- Lock the seats
SELECT * FROM seats
WHERE show_id = $1 AND seat_number = ANY($2)
FOR UPDATE;

-- Validation logic here...

COMMIT;
```

### 2. Booking Expiry Mechanism

**Background Job (runs every 30 seconds):**
```javascript
const cleanupExpiredBookings = async () => {
  // Find and expire old pending bookings
  const expiredBookings = await pool.query(`
    SELECT * FROM bookings
    WHERE status = 'pending' AND expires_at < CURRENT_TIMESTAMP
  `);

  for (const booking of expiredBookings) {
    // Mark booking as expired
    await pool.query(`
      UPDATE bookings SET status = 'expired'
      WHERE id = $1
    `, [booking.id]);

    // Release locked seats
    await pool.query(`
      UPDATE seats SET status = 'available', locked_until = NULL
      WHERE show_id = $1 AND seat_number = ANY($2)
    `, [booking.show_id, booking.seat_ids]);
  }
};
```

### 3. Optimistic Concurrency (Future Enhancement)

For very high throughput, implement version-based optimistic locking:
- Add `version` column to critical tables
- Check version on update operations
- Retry on version conflicts

## Scalability Considerations

### 1. Database Sharding Strategy

**Horizontal Sharding by Show ID:**
```
Shard 1: show_id % 4 == 0
Shard 2: show_id % 4 == 1
Shard 3: show_id % 4 == 2
Shard 4: show_id % 4 == 3
```

**Benefits:**
- Even distribution of booking load
- Localized seat conflicts within shards
- Easier capacity planning per shard

### 2. Read Replicas for Performance

**Read Operations:**
- Show listings → Read replicas
- Seat availability → Read replicas
- User booking history → Read replicas

**Write Operations:**
- Seat bookings → Primary only
- Show creation → Primary only
- User registration → Primary only

### 3. Caching Strategy

**Redis Cache Usage:**
```javascript
// Cache popular shows for 5 minutes
const CACHE_TTL = 300;

const getCachedShows = async () => {
  const cached = await redis.get('popular_shows');
  if (cached) return JSON.parse(cached);

  const shows = await db.query('SELECT * FROM shows WHERE start_time > NOW()');
  await redis.setex('popular_shows', CACHE_TTL, JSON.stringify(shows));
  return shows;
};
```

**Cache Invalidation:**
- Show creation/update → Clear show cache
- Seat booking → Clear specific show cache
- Time-based expiration for stale data

### 4. Message Queue Integration

**Asynchronous Processing:**
```
Booking Request → Queue → Worker → Database Update → Notification
```

**Benefits:**
- Decouple booking requests from immediate processing
- Handle traffic spikes with queue buffering
- Enable retry logic for failed operations
- Support for multiple worker instances

## API Design

### RESTful Endpoints

```
Authentication:
POST /api/auth/register
POST /api/auth/login

Shows:
GET  /api/shows              # List shows (cached)
GET  /api/shows/:id          # Show details with seats
POST /api/shows              # Create show (admin only)

Bookings:
GET  /api/bookings           # User bookings
GET  /api/bookings/:id       # Booking status
POST /api/bookings           # Book seats
```

### Rate Limiting

**Per User Limits:**
- Booking attempts: 10/minute
- Show listings: 100/minute
- Authentication: 5/minute

**Implementation:**
```javascript
const rateLimit = require('express-rate-limit');

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  message: 'Too many booking attempts, please try again later'
});
```

## Monitoring and Observability

### Key Metrics to Track

1. **Performance Metrics:**
   - Booking request latency
   - Database query performance
   - Cache hit/miss ratios
   - Queue processing times

2. **Business Metrics:**
   - Booking success/failure rates
   - Seat utilization percentages
   - Peak booking periods
   - User engagement metrics

3. **System Health:**
   - Database connection pool usage
   - Memory and CPU utilization
   - Error rates by endpoint
   - Background job performance

### Logging Strategy

**Structured Logging:**
```javascript
logger.info('Booking created', {
  bookingId: booking.id,
  userId: userId,
  showId: showId,
  seatCount: seats.length,
  timestamp: new Date().toISOString()
});
```

**Log Levels:**
- ERROR: System failures, booking conflicts
- WARN: Performance issues, unusual patterns
- INFO: Successful operations, state changes
- DEBUG: Detailed execution flow

## Security Considerations

### Authentication & Authorization

**JWT Token Management:**
```javascript
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Role-Based Access:**
- Admin: Full system access
- User: Booking operations only
- Public: Read-only show information

### Data Protection

**Input Validation:**
```javascript
const validateBookingRequest = (req, res, next) => {
  const { show_id, seat_numbers } = req.body;

  if (!show_id || !Array.isArray(seat_numbers) || seat_numbers.length === 0) {
    return res.status(400).json({ error: 'Invalid booking request' });
  }

  // Additional validation logic...
  next();
};
```

**SQL Injection Prevention:**
- Parameterized queries only
- Input sanitization
- Prepared statements

## Deployment Architecture

### Production Setup

```
┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │
│   (nginx)       │────►│   (Kubernetes) │
└─────────────────┘    └─────────────────┘
                              │
               ┌──────────────┼──────────────┐
               │              │              │
      ┌────────▼────────┐ ┌───▼────┐ ┌──────▼──────┐
      │  App Servers    │ │ Redis  │ │ PostgreSQL  │
      │  (Node.js)      │ │ Cluster│ │ Cluster     │
      └─────────────────┘ └────────┘ └─────────────┘
```

### Containerization

**Docker Configuration:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000

CMD ["npm", "start"]
```

**Kubernetes Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ticket-booking-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ticket-booking-api
  template:
    metadata:
      labels:
        app: ticket-booking-api
    spec:
      containers:
      - name: api
        image: ticket-booking:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

## Disaster Recovery

### Backup Strategy

**Database Backups:**
- Full backups: Daily at 2 AM
- Incremental backups: Every 6 hours
- Point-in-time recovery: 1-hour granularity
- Cross-region replication for critical data

**Application Backups:**
- Code artifacts stored in artifact repository
- Configuration backups with encryption
- Infrastructure as Code for environment recreation

### Failover Procedures

**Database Failover:**
1. Promote read replica to primary
2. Update application connection strings
3. Verify data consistency
4. Resume normal operations

**Application Failover:**
1. Load balancer redirects traffic to healthy instances
2. Auto-scaling provisions new instances
3. Monitor recovery and performance
4. Conduct post-mortem analysis

## Performance Optimization

### Database Optimization

**Query Optimization:**
```sql
-- Use covering indexes
CREATE INDEX idx_bookings_composite
ON bookings(user_id, status, created_at DESC);

-- Optimize seat queries
CREATE INDEX idx_seats_available
ON seats(show_id, status)
WHERE status = 'available';
```

**Connection Pooling:**
```javascript
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,        // Maximum connections
  min: 5,         // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Caching Layers

**Multi-Level Caching:**
1. **Browser Cache**: Static assets, API responses
2. **CDN**: Global distribution of static content
3. **Application Cache**: Frequently accessed data
4. **Database Cache**: Query result caching

## Future Enhancements

### Advanced Features

1. **Real-time Updates:**
   - WebSocket connections for live seat updates
   - Server-sent events for booking confirmations
   - Push notifications for status changes

2. **Machine Learning:**
   - Dynamic pricing based on demand
   - Fraud detection algorithms
   - Personalized recommendations

3. **Microservices Migration:**
   - Separate services for auth, booking, notifications
   - Event-driven architecture
   - API gateway with service mesh

4. **Global Expansion:**
   - Multi-region deployment
   - Localized content and pricing
   - Currency conversion and tax handling

This design provides a solid foundation for a high-performance, scalable ticket booking system capable of handling millions of concurrent users while maintaining data consistency and system reliability.
