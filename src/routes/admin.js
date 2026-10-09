const router = require('express').Router();
const { query, queryOne } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Token inválido' }); }
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await queryOne('SELECT * FROM admin_users WHERE email=?', [email]);
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

// Contactos
router.get('/contactos', auth, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM contactos ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.put('/contactos/:id', auth, async (req, res) => {
  try {
    await query('UPDATE contactos SET estado=? WHERE id=?', [req.body.estado, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

// Testimonios
router.get('/testimonios', auth, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM testimonios ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.put('/testimonios/:id', auth, async (req, res) => {
  try {
    await query('UPDATE testimonios SET aprobado=? WHERE id=?', [req.body.aprobado, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.delete('/testimonios/:id', auth, async (req, res) => {
  try {
    await query('DELETE FROM testimonios WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

module.exports = router;
