const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyAdminToken } = require('./auth');

// GET /api/settings/ai-key - Get active Gemini API key
router.get('/ai-key', (req, res) => {
  try {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get();
    const apiKey = row ? row.value : '';
    res.json({ apiKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/ai-key - Update active Gemini API key (Admin only)
router.put('/ai-key', verifyAdminToken, (req, res) => {
  try {
    const { apiKey } = req.body;
    if (apiKey === undefined) {
      return res.status(400).json({ error: 'API key wajib diisi' });
    }

    const stmt = db.prepare(`
      INSERT INTO settings (key, value) VALUES ('gemini_api_key', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    stmt.run(apiKey.trim());

    res.json({ message: 'API Key Google AI Studio berhasil diperbarui', apiKey: apiKey.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/settings/test-ai - Test Gemini API connection & key validity
router.post('/test-ai', async (req, res) => {
  try {
    let { apiKey } = req.body;
    if (!apiKey) {
      const row = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get();
      apiKey = row ? row.value : '';
    }

    if (!apiKey) {
      return res.status(400).json({ connected: false, message: 'API Key belum dikonfigurasi' });
    }

    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemma-4-26b-a4b-it', 'gemini-flash-latest'];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const startTime = Date.now();
        const apiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Tes koneksi NiuBot AI' }] }]
          })
        });

        const data = await apiRes.json();
        const latency = Date.now() - startTime;

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return res.json({
            connected: true,
            model: model,
            latency: `${latency}ms`,
            message: `Terhubung ke Google AI Studio (${model}) - Latensi ${latency}ms`
          });
        }
      } catch (e) {
        // Continue to next model candidate
      }
    }

    res.status(400).json({
      connected: false,
      message: 'Gagal terhubung ke Google AI Studio. Pastikan API Key valid dan memiliki kuota.'
    });

  } catch (err) {
    res.status(500).json({ connected: false, message: err.message });
  }
});

module.exports = router;
