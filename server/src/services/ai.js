let fetchFn;
try { fetchFn = global.fetch || require('node-fetch'); } catch (_) { fetchFn = null; }

async function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  let OpenAILocal;
  try { OpenAILocal = require('openai'); } catch (_) { return null; }
  try { return new OpenAILocal({ apiKey }); } catch (_) { return null; }
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  let GoogleGenerativeAI;
  try { GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI; } catch (_) { return null; }
  try { return new GoogleGenerativeAI(apiKey); } catch (_) { return null; }
}

function buildPrompt(interests) {
  const list = interests && interests.length ? interests.join(', ') : 'AI, Design, Environment';
  return `You are an expert career analyst. Given user interests: [${list}], propose 6-9 suitable career paths.
For each career, include: title, summary (<= 30 words), trendingRoles (3), inDemandSkills (5).
Also propose a simple mindmap with nodes and edges connecting interests -> skills -> careers where appropriate.
Return ONLY valid JSON with this shape:
{
  "careers": [ { "title": string, "summary": string, "trendingRoles": string[], "inDemandSkills": string[] } ],
  "nodes": [ { "id": string, "data": { "label": string, "summary"?: string }, "position": { "x": number, "y": number } } ],
  "edges": [ { "id": string, "source": string, "target": string } ]
}`;
}

function sample(interests, meta) {
  const ints = interests && interests.length ? interests : ['AI', 'Design'];
  const nodes = [
    { id: 'root', data: { label: 'Interests' }, position: { x: 0, y: 0 } },
    ...ints.map((t, i) => ({ id: `i-${i}`, data: { label: t }, position: { x: -150 + i*150, y: 120 } })),
    { id: 'skill-ml', data: { label: 'Machine Learning' }, position: { x: -150, y: 260 } },
    { id: 'skill-ui', data: { label: 'UI/UX' }, position: { x: 0, y: 260 } },
    { id: 'career-ml-eng', data: { label: 'ML Engineer', summary: 'Build and deploy ML systems' }, position: { x: -150, y: 420 } },
    { id: 'career-product-des', data: { label: 'Product Designer', summary: 'Design user-centric products' }, position: { x: 0, y: 420 } },
  ];
  const edges = [
    ...ints.map((_, i) => ({ id: `e-root-${i}`, source: 'root', target: `i-${i}` })),
    { id: 'e-i0-skill-ml', source: 'i-0', target: 'skill-ml' },
    { id: 'e-i1-skill-ui', source: 'i-1', target: 'skill-ui' },
    { id: 'e-skill-ml-career', source: 'skill-ml', target: 'career-ml-eng' },
    { id: 'e-skill-ui-career', source: 'skill-ui', target: 'career-product-des' },
  ];
  const careers = [
    { title: 'ML Engineer', summary: 'Design and scale ML models', trendingRoles: ['ML Ops', 'GenAI Engineer', 'Data Scientist'], inDemandSkills: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Cloud'] },
    { title: 'Product Designer', summary: 'Create usable product experiences', trendingRoles: ['UX Researcher', 'Design Systems', 'Interaction Designer'], inDemandSkills: ['Figma', 'User Research', 'Prototyping', 'Accessibility', 'Design Systems'] },
  ];
  return { aiGenerated: false, ...meta, careers, nodes, edges };
}

function normalizeGraph(raw) {
  const nodesIn = Array.isArray(raw?.nodes) ? raw.nodes : [];
  const edgesIn = Array.isArray(raw?.edges) ? raw.edges : [];
  const careersIn = Array.isArray(raw?.careers) ? raw.careers : [];

  let nodes = nodesIn.map((n) => ({ id: String(n.id), data: n.data || { label: String(n.id) }, position: n.position || { x: 0, y: 0 } }));
  const idSet = new Set(nodes.map((n) => n.id));
  let edges = edgesIn
    .map((e, i) => ({ id: String(e.id || `e-${i}`), source: String(e.source), target: String(e.target) }))
    .filter((e) => e.source && e.target);

  if (!nodes.length && careersIn.length) {
    nodes = careersIn.map((c, i) => ({ id: `career-${i}`, data: { label: c.title || `Career ${i+1}`, summary: c.summary, trendingRoles: c.trendingRoles, inDemandSkills: c.inDemandSkills }, position: { x: (i%4)*240, y: Math.floor(i/4)*180 } }));
  }

  // ensure any edge endpoints exist as nodes
  for (const e of edges) {
    if (!idSet.has(e.source)) {
      const id = e.source; idSet.add(id); nodes.push({ id, data: { label: id }, position: { x: 0, y: 0 } });
    }
    if (!idSet.has(e.target)) {
      const id = e.target; idSet.add(id); nodes.push({ id, data: { label: id }, position: { x: 0, y: 0 } });
    }
  }

  // filter invalid edges again
  const nodeIds = new Set(nodes.map(n => n.id));
  edges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

  return { nodes, edges };
}

function buildGraphFromCareers(interests, careers) {
  const root = { id: 'root', data: { label: 'Interests' }, position: { x: 0, y: 0 } };
  const interestNodes = (interests || []).map((t, i) => ({ id: `i-${i}`, data: { label: t }, position: { x: -200 + i * 200, y: 120 } }));
  const careerNodes = (careers || []).map((c, i) => ({ id: `career-${i}`, data: { label: c.title || `Career ${i+1}`, summary: c.summary, trendingRoles: c.trendingRoles, inDemandSkills: c.inDemandSkills }, position: { x: (i%4)*240, y: 420 + Math.floor(i/4)*180 } }));
  // Create skill nodes: take top 6 unique skills across careers
  const skills = Array.from(new Set((careers || []).flatMap(c => c.inDemandSkills || []))).slice(0, 6);
  const skillNodes = skills.map((s, i) => ({ id: `skill-${i}`, data: { label: s }, position: { x: -240 + i * 160, y: 260 } }));

  const nodes = [root, ...interestNodes, ...skillNodes, ...careerNodes];
  const edges = [];
  interestNodes.forEach((n, i) => edges.push({ id: `e-root-${i}`, source: 'root', target: n.id }));
  // naive linking: connect each interest to all careers (ensures a connected graph)
  interestNodes.forEach((n) => {
    careerNodes.forEach((c) => edges.push({ id: `e-${n.id}-${c.id}`, source: n.id, target: c.id }));
  });
  // link skills to careers when skill present
  careerNodes.forEach((c, ci) => {
    const skillSet = new Set(((careers[ci] || {}).inDemandSkills) || []);
    skillNodes.forEach((s) => { if (skillSet.has(s.data.label)) edges.push({ id: `e-${s.id}-${c.id}`, source: s.id, target: c.id }); });
  });
  return { nodes, edges };
}

async function getRecommendations(interests, { provider, model } = {}) {
  const prov = provider || process.env.AI_PROVIDER || 'openai';
  const mdl = model || (prov === 'gemini' ? process.env.GEMINI_MODEL || 'gemini-1.5-flash' : process.env.OPENAI_MODEL || 'gpt-4o-mini');
  if ((prov === 'openai' && !process.env.OPENAI_API_KEY) ||
      (prov === 'gemini' && !process.env.GEMINI_API_KEY)) {
    return sample(interests, { provider: prov, model: mdl });
  }

  if (prov === 'ollama') {
    try {
      const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
      // Ask only for careers JSON; we'll build the graph deterministically
      const careersPrompt = `You are an expert career analyst. Given user interests: [${(interests||[]).join(', ')}], output ONLY valid JSON (no markdown, no code fences) with this shape: {"careers": [ { "title": string, "summary": string, "trendingRoles": string[], "inDemandSkills": string[] } ] }`;
      const body = { model: mdl || 'llama3', prompt: careersPrompt, stream: false, options: { temperature: 0.7 } };
      const resp = await fetchFn(`${host}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error(`ollama status ${resp.status}`);
      const json = await resp.json();
      const content = (json?.response || '{}').replace(/^```json\n?|```$/g, '');
      let parsed;
      try { parsed = JSON.parse(content); } catch (_) { parsed = {}; }
      const careers = Array.isArray(parsed.careers) ? parsed.careers : [];
      const built = buildGraphFromCareers(interests, careers);
      if (!built.nodes.length) return sample(interests, { provider: prov, model: mdl });
      return { aiGenerated: true, provider: prov, model: mdl, careers, ...built };
    } catch (e) {
      console.error('ollama error', e);
      return sample(interests, { provider: prov, model: mdl });
    }
  }

  const prompt = buildPrompt(interests);
  if (prov === 'gemini') {  
    try {
      const genAI = getGeminiClient();
      if (!genAI) return sample(interests, { provider: prov, model: mdl });
      const modelInst = genAI.getGenerativeModel({ model: mdl });
      const resp = await modelInst.generateContent([
        { text: 'Return ONLY valid JSON. No code fences, no markdown.' },
        { text: prompt },
      ]);
      const raw = resp.response?.text?.() || '{}';
      const content = raw.replace(/^```json\n?|```$/g, '');
      const parsed = JSON.parse(content);
      const norm = normalizeGraph(parsed);
      if (!norm.nodes.length) return sample(interests, { provider: prov, model: mdl });
      return { aiGenerated: true, provider: prov, model: mdl, careers: parsed.careers || [], ...norm };
    } catch (e) {
      console.error('gemini error', e);
      return sample(interests, { provider: prov, model: mdl });
    }
  }

  try {
    const openai = await getOpenAIClient();
    if (!openai) return sample(interests, { provider: prov, model: mdl });
    const completion = await openai.chat.completions.create({
      model: mdl,
      messages: [
        { role: 'system', content: 'Return ONLY valid JSON. No code fences, no markdown.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });
    const raw = completion.choices?.[0]?.message?.content || '{}';
    const content = raw.replace(/^```json\n?|```$/g, '');
    const parsed = JSON.parse(content);
    const norm = normalizeGraph(parsed);
    if (!norm.nodes.length) return sample(interests, { provider: prov, model: mdl });
    return { aiGenerated: true, provider: prov, model: mdl, careers: parsed.careers || [], ...norm };
  } catch (e) {
    console.error('openai error', e);
    return sample(interests, { provider: prov, model: mdl });
  }
}

module.exports = { getRecommendations };


