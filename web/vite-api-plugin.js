// vite-api-plugin.js
//
// Custom Vite plugin: intercepts POST /api/generate during `npm run dev`
// so the frontend can call the same endpoint locally as it does once
// deployed to Vercel (where api/generate.js takes over instead).

import { generateToken } from './src/lib/generate-token.js';
import { generateLogo } from './src/lib/generate-logo.js';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export default function apiPlugin() {
  return {
    name: 'pumpforge-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res, next) => {
        if (req.url === '/api/generate-logo' || req.originalUrl?.includes('/api/generate-logo')) {
          return next();
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const body = await readBody(req);
          const token = await generateToken(body.idea);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(token));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Generation failed' }));
        }
      });

      server.middlewares.use('/api/generate-logo', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const body = await readBody(req);
          const result = await generateLogo(body);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Logo generation failed' }));
        }
      });
    },
  };
}

