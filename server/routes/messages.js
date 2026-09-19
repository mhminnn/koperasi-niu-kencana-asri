const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyAdminToken } = require('./auth');

// POST /api/messages - Send contact message (Public)
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nama, Email, dan Pesan wajib diisi' });
    }

    const stmt = db.prepare(`
      INSERT INTO messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, subject || 'Pertanyaan Umum', message);
    res.status(201).json({ message: 'Pesan Anda telah berhasil dikirim! Kami akan segera menghubungi Anda.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages - View all messages (Admin only)
router.get('/', verifyAdminToken, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY id DESC').all();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messages/:id - Delete message (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
