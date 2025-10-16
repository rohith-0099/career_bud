const { Router } = require('express');
let fetchFn;
try {
  fetchFn = global.fetch || require('node-fetch');
} catch (_) {
  fetchFn = null;
}

const router = Router();

router.get('/models', async (_req, res) => {
  try {
    const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const resp = fetchFn ? await fetchFn(`${host}/api/tags`) : null;
    if (!resp || !resp.ok) {
      return res.json({ models: ['llama3:latest', 'gemma3:latest', 'mistral:latest', 'codellama:7b'] });
    }
    const data = await resp.json();
    const models = Array.isArray(data?.models) ? data.models.map((m) => m?.name).filter(Boolean) : [];
    res.json({ models });
  } catch (e) {
    console.error('ollama models error', e);
    res.json({ models: ['llama3:latest', 'gemma3:latest', 'mistral:latest', 'codellama:7b'] });
  }
});

module.exports = router;


