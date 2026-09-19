const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { verifyAdminToken } = require('./auth');

// Setup multer image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Create product (Admin only)
router.post('/', verifyAdminToken, upload.single('image'), (req, res) => {
  try {
    const { name, description, category, price, badge } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    if (!name) {
      return res.status(400).json({ error: 'Nama produk wajib diisi' });
    }

    const stmt = db.prepare(`
      INSERT INTO products (name, description, category, price, image_url, badge)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      description || '',
      category || 'Umum',
      parseFloat(price) || 0,
      image_url,
      badge || 'Unggulan'
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Produk berhasil ditambahkan', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', verifyAdminToken, upload.single('image'), (req, res) => {
  try {
    const { name, description, category, price, badge } = req.body;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    let image_url = existing.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, category = ?, price = ?, image_url = ?, badge = ?
      WHERE id = ?
    `);

    stmt.run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      category || existing.category,
      price !== undefined ? parseFloat(price) : existing.price,
      image_url,
      badge || existing.badge,
      req.params.id
    );

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json({ message: 'Produk berhasil diperbarui', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
