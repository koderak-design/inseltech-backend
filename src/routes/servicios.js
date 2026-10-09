const router = require('express').Router();
const { query } = require('../db');

router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM servicios WHERE activo=1 ORDER BY orden ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

module.exports = router;
