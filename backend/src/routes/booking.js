const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get user bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [bookings] = await connection.query(
      'SELECT b.*, s.title, s.date, s.time FROM bookings b JOIN shows s ON b.show_id = s.id WHERE b.user_id = ? ORDER BY b.booking_date DESC',
      [req.params.userId]
    );
    connection.release();
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { userId, showId, numberOfSeats } = req.body;

    const connection = await pool.getConnection();

    // Get show details
    const [shows] = await connection.query('SELECT * FROM shows WHERE id = ?', [showId]);

    if (shows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Show not found' });
    }

    const show = shows[0];

    if (show.available_seats < numberOfSeats) {
      connection.release();
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const totalPrice = show.price * numberOfSeats;

    // Create booking
    const [result] = await connection.query(
      'INSERT INTO bookings (user_id, show_id, number_of_seats, total_price) VALUES (?, ?, ?, ?)',
      [userId, showId, numberOfSeats, totalPrice]
    );

    // Update available seats
    await connection.query(
      'UPDATE shows SET available_seats = available_seats - ? WHERE id = ?',
      [numberOfSeats, showId]
    );

    connection.release();
    res.status(201).json({ id: result.insertId, totalPrice, message: 'Booking created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get booking details
    const [bookings] = await connection.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);

    if (bookings.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];

    // Cancel booking
    await connection.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', req.params.id]);

    // Restore available seats
    await connection.query(
      'UPDATE shows SET available_seats = available_seats + ? WHERE id = ?',
      [booking.number_of_seats, booking.show_id]
    );

    connection.release();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
