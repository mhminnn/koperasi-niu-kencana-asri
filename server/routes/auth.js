const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'niu_kencana_secret_key_2026';

// Middleware for verifying JWT Admin Token
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token tidak valid atau sudah kadaluwarsa.' });
  }
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  try {
    const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
    if (!admin) {
      return res.status(400).json({ error: 'Username atau password salah.' });
    }

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Username atau password salah.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server: ' + err.message });
  }
});

// GET /api/auth/me (Verify active session)
router.get('/me', verifyAdminToken, (req, res) => {
  res.json({ admin: req.admin });
});

// PUT /api/auth/change-password (Change Admin Password)
router.post('/change-password', verifyAdminToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password lama dan password baru wajib diisi.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
  }

  try {
    const admin = db.prepare('SELECT * FROM admin WHERE id = ?').get(req.admin.id);
    if (!admin) {
      return res.status(404).json({ error: 'Akun admin tidak ditemukan.' });
    }

    const validPassword = bcrypt.compareSync(currentPassword, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Password lama Anda salah.' });
    }

    const newHashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin SET password = ? WHERE id = ?').run(newHashedPassword, req.admin.id);

    res.json({ message: 'Password admin berhasil diperbarui!' });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server: ' + err.message });
  }
});

module.exports = { router, verifyAdminToken };
