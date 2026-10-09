require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/analytics', require('./routes/analytics'));

app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/testimonios', require('./routes/testimonios'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`InselTech API running on port ${PORT}`));
