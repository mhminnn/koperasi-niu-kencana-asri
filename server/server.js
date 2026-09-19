const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { router: authRouter } = require('./routes/auth');
const productsRouter = require('./routes/products');
const newsRouter = require('./routes/news');
const partnersRouter = require('./routes/partners');
const messagesRouter = require('./routes/messages');
const socialsRouter = require('./routes/socials');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder for images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/news', newsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/socials', socialsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Koperasi Niu Kencana Asri API Server Running' });
});

// Social Share Open Graph endpoint for News (WhatsApp, Facebook, Telegram Preview)
app.get('/share/news/:id', (req, res) => {
  const db = require('./db');
  try {
    const news = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!news) return res.redirect('/berita');

    const host = req.protocol + '://' + req.get('host');
    let coverImg = news.image_url || '';
    if (coverImg && !coverImg.startsWith('http')) {
      coverImg = host + coverImg;
    }
    if (!coverImg) {
      coverImg = host + '/about-team.jpg';
    }

    const title = news.title + ' - Koperasi Niu Kencana Asri';
    const description = news.excerpt || news.content.substring(0, 150) + '...';
    const redirectUrl = `/berita?id=${news.id}`;

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / WhatsApp / Facebook Meta Tags -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${coverImg}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${host}/share/news/${news.id}">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${coverImg}">

  <script>
    // Auto redirect human visitors to frontend article
    window.location.href = "${redirectUrl}";
  </script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px;">
  <h2>${news.title}</h2>
  <p>${description}</p>
  <p><a href="${redirectUrl}">Klik di sini jika tidak teralihkan otomatis...</a></p>
</body>
</html>
    `;
    res.send(html);
  } catch (err) {
    res.redirect('/berita');
  }
});

// Serve production static frontend build if dist folder exists
const distPath = path.join(__dirname, '../dist');
const fs = require('fs');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/share')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


