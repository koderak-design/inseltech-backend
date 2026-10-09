const router = require('express').Router();
const { query } = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: '../uploads/fotos',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM proyectos WHERE activo=1 ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.post('/', upload.fields([{ name: 'foto_antes' }, { name: 'foto_despues' }]), async (req, res) => {
  try {
    const { titulo, descripcion, categoria, video_url } = req.body;
    const foto_antes = req.files?.foto_antes?.[0]?.filename ? `/uploads/fotos/${req.files.foto_antes[0].filename}` : null;
    const foto_despues = req.files?.foto_despues?.[0]?.filename ? `/uploads/fotos/${req.files.foto_despues[0].filename}` : null;
    await query(
      'INSERT INTO proyectos (titulo, descripcion, categoria, foto_antes, foto_despues, video_url) VALUES (?,?,?,?,?,?)',
      [titulo, descripcion||null, categoria||null, foto_antes, foto_despues, video_url||null]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await query('UPDATE proyectos SET activo=0 WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

module.exports = router;
