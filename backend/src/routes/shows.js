const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [shows] = await connection.query('SELECT * FROM shows');
    connection.release();
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

// Get show by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [shows] = await connection.query('SELECT * FROM shows WHERE id = ?', [req.params.id]);
    connection.release();

    if (shows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.json(shows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch show' });
  }
});

// Create show (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, showType, date, time, duration, location, totalSeats, price } = req.body;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO shows (title, description, show_type, date, time, duration, location, total_seats, available_seats, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, showType, date, time, duration, location, totalSeats, totalSeats, price]
    );

    connection.release();
    res.status(201).json({ id: result.insertId, message: 'Show created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create show' });
  }
});

module.exports = router;
