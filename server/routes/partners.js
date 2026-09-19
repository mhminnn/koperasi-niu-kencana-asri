const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { verifyAdminToken } = require('./auth');

// Setup multer logo storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'partner-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// GET /api/partners - Get all partner logos
router.get('/', (req, res) => {
  try {
    const partners = db.prepare('SELECT * FROM partners ORDER BY id DESC').all();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/partners - Create partner logo (Admin only)
router.post('/', verifyAdminToken, upload.single('logo'), (req, res) => {
  try {
    const { name, website } = req.body;
    let logo_url = req.body.logo_url || '';

    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
    }

    if (!name) {
      return res.status(400).json({ error: 'Nama mitra / instansi wajib diisi' });
    }

    if (!logo_url) {
      return res.status(400).json({ error: 'Logo wajib diunggah atau diisi URL' });
    }

    const stmt = db.prepare(`
      INSERT INTO partners (name, logo_url, website)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(name, logo_url, website || '#');
    const newPartner = db.prepare('SELECT * FROM partners WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Logo kolaborasi berhasil ditambahkan', partner: newPartner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/partners/:id - Update partner logo (Admin only)
router.put('/:id', verifyAdminToken, upload.single('logo'), (req, res) => {
  try {
    const { name, website } = req.body;
    const existing = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Mitra tidak ditemukan' });
    }

    let logo_url = existing.logo_url;
    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
    } else if (req.body.logo_url) {
      logo_url = req.body.logo_url;
    }

    const stmt = db.prepare(`
      UPDATE partners 
      SET name = ?, logo_url = ?, website = ?
      WHERE id = ?
    `);

    stmt.run(name || existing.name, logo_url, website !== undefined ? website : existing.website, req.params.id);

    const updated = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    res.json({ message: 'Logo mitra berhasil diperbarui', partner: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/partners/:id - Delete partner logo (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Mitra tidak ditemukan' });
    }

    db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
    res.json({ message: 'Logo kolaborasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
