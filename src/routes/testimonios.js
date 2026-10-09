const router = require('express').Router();
const { query } = require('../db');

router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM testimonios WHERE aprobado=1 ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, cargo, texto, calificacion } = req.body;
    await query(
      'INSERT INTO testimonios (nombre, cargo, texto, calificacion) VALUES (?,?,?,?)',
      [nombre, cargo||null, texto, calificacion||5]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

module.exports = router;
