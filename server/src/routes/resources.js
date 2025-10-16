const { Router } = require('express');
const { fetchResources } = require('../services/resources');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    const resources = await fetchResources(q);
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

module.exports = router;


