const axios = require('axios');

async function fetchResources(query) {
  const q = encodeURIComponent(query || 'career exploration');
  const results = [];
  // YouTube search via no-key fallback (dummy) or use your own API if available
  // For demo, we return curated links
  results.push({ title: `Intro to ${query} - YouTube`, url: `https://www.youtube.com/results?search_query=${q}`, source: 'YouTube' });
  results.push({ title: `${query} courses on Coursera`, url: `https://www.coursera.org/search?query=${q}`, source: 'Coursera' });
  results.push({ title: `${query} beginner roadmap`, url: `https://www.google.com/search?q=${q}+beginner+roadmap`, source: 'Web' });
  return results;
}

module.exports = { fetchResources };


