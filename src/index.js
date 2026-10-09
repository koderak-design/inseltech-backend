require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
const uploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, '../uploads');
console.log('UPLOADS_PATH:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/analytics', require('./routes/analytics'));

app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/testimonios', require('./routes/testimonios'));

app.use(express.static(path.join(__dirname, '../public')));
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else { next(); }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`InselTech API running on port ${PORT}`));
