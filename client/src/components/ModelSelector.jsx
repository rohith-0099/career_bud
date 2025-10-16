import { useEffect, useState } from 'react';
import { useCareerStore } from '../store/careerStore';
import { api } from '../services/api';

export default function ModelSelector() {
  const { aiProvider, aiModel, setAI } = useCareerStore();
  const [ollamaModels, setOllamaModels] = useState([]);
  useEffect(() => {
    if (aiProvider === 'ollama') {
      api.get('/api/ollama/models').then(({ data }) => {
        const models = data.models || [];
        setOllamaModels(models);
        if (!models.includes(aiModel) && models.length) {
          setAI({ model: models[0] });
        }
      }).catch(() => setOllamaModels([]));
    }
  }, [aiProvider]);
  return (
    <div className="flex items-center gap-2 text-xs">
      <select value={aiProvider} onChange={(e) => setAI({ provider: e.target.value })} className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1">
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
        <option value="ollama">Local (Ollama)</option>
      </select>
      {aiProvider === 'openai' && (
        <select value={aiModel} onChange={(e) => setAI({ model: e.target.value })} className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-40">
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="o3-mini">o3-mini</option>
        </select>
      )}
      {aiProvider === 'gemini' && (
        <select value={aiModel} onChange={(e) => setAI({ model: e.target.value })} className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-44">
          <option value="gemini-1.5-flash">gemini-1.5-flash</option>
          <option value="gemini-1.5-pro">gemini-1.5-pro</option>
        </select>
      )}
      {aiProvider === 'ollama' && (
        <select value={aiModel} onChange={(e) => setAI({ model: e.target.value })} className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-48">
          {[aiModel, ...ollamaModels].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      )}
    </div>
  );
}


