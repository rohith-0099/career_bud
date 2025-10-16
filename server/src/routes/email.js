const { Router } = require('express');
const { sendSummaryEmail } = require('../services/email');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email, careers } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email required' });
    const ok = await sendSummaryEmail({ to: email, careers: careers || [] });
    res.json({ sent: true, ...ok });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;


