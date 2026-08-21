// web/api/generate-logo.js
// Vercel Serverless Function for generating memecoin mascot logos

import { generateLogo } from '../src/lib/generate-logo.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, ticker, logoPrompt, idea, seed } = req.body || {};
    const result = await generateLogo({ name, ticker, logoPrompt, idea, seed });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Logo generation failed' });
  }
}
