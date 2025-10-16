const { Router } = require('express');
const { getRecommendations } = require('../services/ai');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { interests, provider, model } = req.query || {};
    const ints = typeof interests === 'string' ? interests.split(',').map(s => s.trim()).filter(Boolean) : [];
    const data = await getRecommendations(ints, { provider, model });
    res.json(data);
  } catch (err) {
    console.error('recommendations get error', err);
    res.status(200).json({ aiGenerated: false, provider: 'fallback', model: 'sample', careers: [], nodes: [], edges: [] });
  }
});

router.post('/', async (req, res) => {
  try {
    const { interests, provider, model } = req.body || {};
    const data = await getRecommendations(interests || [], { provider, model });
    res.json(data);
  } catch (err) {
    console.error('recommendations error', err);
    res.status(200).json({
      aiGenerated: false,
      provider: 'fallback',
      model: 'sample',
      careers: [
        { title: 'ML Engineer', summary: 'Design and scale ML models', trendingRoles: ['ML Ops', 'GenAI Engineer', 'Data Scientist'], inDemandSkills: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Cloud'] },
        { title: 'Product Designer', summary: 'Create usable product experiences', trendingRoles: ['UX Researcher', 'Design Systems', 'Interaction Designer'], inDemandSkills: ['Figma', 'User Research', 'Prototyping', 'Accessibility', 'Design Systems'] },
      ],
      nodes: [
        { id: 'root', data: { label: 'Interests' }, position: { x: 0, y: 0 } },
        { id: 'i-0', data: { label: 'AI' }, position: { x: -150, y: 120 } },
        { id: 'i-1', data: { label: 'Design' }, position: { x: 150, y: 120 } },
        { id: 'skill-ml', data: { label: 'Machine Learning' }, position: { x: -150, y: 260 } },
        { id: 'skill-ui', data: { label: 'UI/UX' }, position: { x: 150, y: 260 } },
        { id: 'career-ml-eng', data: { label: 'ML Engineer', summary: 'Build and deploy ML systems' }, position: { x: -150, y: 420 } },
        { id: 'career-product-des', data: { label: 'Product Designer', summary: 'Design user-centric products' }, position: { x: 150, y: 420 } },
      ],
      edges: [
        { id: 'e-root-0', source: 'root', target: 'i-0' },
        { id: 'e-root-1', source: 'root', target: 'i-1' },
        { id: 'e-i0-skill-ml', source: 'i-0', target: 'skill-ml' },
        { id: 'e-i1-skill-ui', source: 'i-1', target: 'skill-ui' },
        { id: 'e-skill-ml-career', source: 'skill-ml', target: 'career-ml-eng' },
        { id: 'e-skill-ui-career', source: 'skill-ui', target: 'career-product-des' },
      ],
    });
  }
});

module.exports = router;


