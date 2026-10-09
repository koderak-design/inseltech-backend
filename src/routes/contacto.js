const router = require('express').Router();
const { query } = require('../db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, tipo, servicio, mensaje } = req.body;
    if (!nombre || !mensaje) return res.status(400).json({ error: 'Nombre y mensaje requeridos' });

    await query(
      'INSERT INTO contactos (nombre, email, telefono, tipo, servicio, mensaje) VALUES (?,?,?,?,?,?)',
      [nombre, email||null, telefono||null, tipo||'residencial', servicio||null, mensaje]
    );

    // Notificación email
    transporter.sendMail({
      from: `"InselTech Web" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `Nuevo contacto — ${nombre}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email || 'No proporcionado'}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
        <p><strong>Tipo:</strong> ${tipo || 'No especificado'}</p>
        <p><strong>Servicio:</strong> ${servicio || 'No especificado'}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `,
    }).catch(e => console.error('Email error:', e.message));

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al guardar contacto' });
  }
});

module.exports = router;
