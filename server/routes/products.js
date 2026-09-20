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

// PUT /api/products/featured - Update featured products for home page (Admin only)
router.put('/featured', verifyAdminToken, (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: 'productIds harus berupa array ID produk' });
    }

    const idsToFeature = productIds.map(Number).filter(id => !isNaN(id)).slice(0, 3);

    db.transaction(() => {
      db.prepare('UPDATE products SET is_featured = 0').run();
      if (idsToFeature.length > 0) {
        const placeholders = idsToFeature.map(() => '?').join(',');
        db.prepare(`UPDATE products SET is_featured = 1 WHERE id IN (${placeholders})`).run(...idsToFeature);
      }
    })();

    const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    res.json({ message: 'Produk unggulan beranda berhasil diperbarui', products });
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
    const { name, description, category, price, badge, is_featured } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    if (!name) {
      return res.status(400).json({ error: 'Nama produk wajib diisi' });
    }

    const featuredVal = is_featured === '1' || is_featured === 1 || is_featured === true ? 1 : 0;

    const stmt = db.prepare(`
      INSERT INTO products (name, description, category, price, image_url, badge, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      description || '',
      category || 'Umum',
      parseFloat(price) || 0,
      image_url,
      badge || 'Unggulan',
      featuredVal
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
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null' || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID produk tidak valid' });
    }

    const { name, description, category, price, badge, is_featured } = req.body;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    let image_url = existing.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const featuredVal = is_featured !== undefined 
      ? (is_featured === '1' || is_featured === 1 || is_featured === true ? 1 : 0)
      : existing.is_featured;

    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, category = ?, price = ?, image_url = ?, badge = ?, is_featured = ?
      WHERE id = ?
    `);

    stmt.run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      category || existing.category,
      price !== undefined ? parseFloat(price) : existing.price,
      image_url,
      badge || existing.badge,
      featuredVal,
      req.params.id
    );

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json({ message: 'Produk berhasil diperbarui', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const fs = require('fs');

function deleteUploadedFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  if (fileUrl.startsWith('/uploads/')) {
    const filename = path.basename(fileUrl);
    const filepath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
        console.error('Failed deleting physical file:', filepath, e);
      }
    }
  }
}

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    if (existing.image_url) {
      deleteUploadedFile(existing.image_url);
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
