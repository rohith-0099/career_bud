require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { initSchema } = require('./utils/db');
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
});
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
});
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/email', require('./routes/email'));
app.use('/api/session', require('./routes/session'));
app.use('/api/ollama', require('./routes/ollama'));

const port = process.env.PORT || 4000;
initSchema().then(() => {
  app.listen(port, () => console.log(`server listening on ${port}`));
}).catch((e) => {
  console.error('failed to init schema', e);
  app.listen(port, () => console.log(`server listening on ${port}`));
});
