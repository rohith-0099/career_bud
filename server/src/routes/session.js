const { Router } = require('express');
const { saveSession, getSession } = require('../services/session');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const saved = await saveSession(req.body || {});
    res.json({ id: saved?._id || null });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await getSession(req.params.id);
    res.json({ session: doc || null });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

module.exports = router;


