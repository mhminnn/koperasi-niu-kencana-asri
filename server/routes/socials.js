const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyAdminToken } = require('./auth');

// GET /api/socials - Get all social media cards
router.get('/', (req, res) => {
  try {
    const socials = db.prepare('SELECT * FROM socials ORDER BY id ASC').all();
    res.json(socials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/socials - Add new social media card (Admin only)
router.post('/', verifyAdminToken, (req, res) => {
  try {
    const { platform, name, handle, description, url, cover_color } = req.body;

    if (!platform || !name || !url) {
      return res.status(400).json({ error: 'Platform, Nama Akun, dan Link/URL wajib diisi.' });
    }

    const stmt = db.prepare(`
      INSERT INTO socials (platform, name, handle, description, url, cover_color)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      platform,
      name,
      handle || '',
      description || '',
      url,
      cover_color || 'from-purple-600 via-pink-500 to-amber-500'
    );

    const newSocial = db.prepare('SELECT * FROM socials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Media sosial berhasil ditambahkan!', social: newSocial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/socials/:id - Update social media card (Admin only)
router.put('/:id', verifyAdminToken, (req, res) => {
  try {
    const { platform, name, handle, description, url, cover_color } = req.body;
    const existing = db.prepare('SELECT * FROM socials WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Media sosial tidak ditemukan' });
    }

    const stmt = db.prepare(`
      UPDATE socials 
      SET platform = ?, name = ?, handle = ?, description = ?, url = ?, cover_color = ?
      WHERE id = ?
    `);

    stmt.run(
      platform || existing.platform,
      name || existing.name,
      handle !== undefined ? handle : existing.handle,
      description !== undefined ? description : existing.description,
      url || existing.url,
      cover_color || existing.cover_color,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM socials WHERE id = ?').get(req.params.id);
    res.json({ message: 'Media sosial berhasil diperbarui!', social: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/socials/:id - Delete social media card (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM socials WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Media sosial tidak ditemukan' });
    }

    db.prepare('DELETE FROM socials WHERE id = ?').run(req.params.id);
    res.json({ message: 'Media sosial berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
