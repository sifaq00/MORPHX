// src/lib/generate-token.js
//
// Core logic shared by both the local Vite dev middleware (vite-api-plugin.js)
// and the Vercel serverless function (api/generate.js). Keeping it in one
// place means "npm run dev" and a real deployment behave identically.

const DEFAULT_API_KEY = 'tp-sbetuv0x14c5wvvfsnwrsvgqgrde895e1uynk2xgp2f91rcz';
const DEFAULT_BASE_URL = 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions';
const DEFAULT_MODEL = 'mimo-v2.5-pro';

const getBaseUrl = () => {
  const base = process.env.MEGALLM_BASE_URL || DEFAULT_BASE_URL;
  if (base.endsWith('/chat/completions') || base.endsWith('/messages')) return base;
  if (base.endsWith('/v1')) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
};
const MEGALLM_URL = getBaseUrl();
const PUMP_FUN_CREATE_URL = 'https://pump.fun/create';

const SYSTEM_PROMPT = `You are a veteran pump.fun token strategist, copywriter, and brand designer.

TASK
Given a short idea from the user, invent ONE original memecoin concept inspired by it. Be creative, funny, and on-trend with current crypto/meme culture — avoid generic or bland naming.

You must respond with PURE JSON and NOTHING ELSE. The JSON object must have exactly these keys:

{
  "ticker": string,      // token symbol, ALWAYS starting with "$", max 10 chars, uppercase, no spaces
  "name": string,        // full token name, punchy, max 4 words
  "tagline": string,     // under 8 words, no ending period
  "description": string, // 2-3 sentences, pump.fun-style hype copy, no hashtags, no emojis
  "lore": string,        // A rich, deep, and engaging backstory/mythology of the token (2-3 paragraphs, use \\n\\n for paragraph breaks)
  "vibeScore": number,   // integer from 1 to 10 rating how "pump.fun-able" the concept is
  "logoPrompt": string,  // A detailed Midjourney/DALL-E ready image generation prompt to create the token's logo/emblem
  "brandColors": string[], // Array of exactly 2 suggested brand color hex codes matching the theme
  "marketingHook": string // A highly viral, tweetable slogan or marketing hook under 120 characters
}

OUTPUT RULES (STRICT)
- Respond with PURE JSON only. No markdown code fences, no \`\`\`json, no explanations, no text before or after the JSON.
- The JSON must be a single valid object, parseable by JSON.parse().
- Do not add, remove, or rename any keys. Do not add trailing commas.
- All string values must escape internal quotes and newlines properly (use \\n\\n for line breaks inside "lore").`;

/**
 * Calls the MegaLLM chat completions endpoint and asks for a strict JSON reply.
 * @param {string} idea - free-text idea from the user
 * @returns {Promise<{ticker:string,name:string,tagline:string,description:string,lore:string,vibeScore:number,logoPrompt:string,brandColors:string[],marketingHook:string}>}
 */
async function callMegaLLM(idea) {
  const apiKey = process.env.MEGALLM_API_KEY || DEFAULT_API_KEY;
  const model = process.env.MEGALLM_MODEL || DEFAULT_MODEL;

  const response = await fetch(MEGALLM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      temperature: 0.9,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Idea: ${idea}` },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`MegaLLM request failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content ?? '';

  let parsed;
  try {
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = raw.slice(firstBrace, lastBrace + 1);
      parsed = JSON.parse(jsonCandidate);
    } else {
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }
  } catch (err) {
    try {
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (err2) {
      throw new Error('MegaLLM did not return valid JSON: ' + (raw || '').slice(0, 300));
    }
  }

  return parsed;
}

function normalizeTicker(ticker) {
  if (!ticker) return '$TOKEN';
  const upper = String(ticker).toUpperCase().replace(/[^A-Z$]/g, '');
  return upper.startsWith('$') ? upper.slice(0, 10) : `$${upper}`.slice(0, 10);
}

function clampVibeScore(score) {
  let n = Number(score);
  if (Number.isNaN(n)) return 9;
  if (n > 10 && n <= 100) n = Math.round(n / 10);
  return Math.min(10, Math.max(1, Math.round(n)));
}

function generateSmartConcept(idea) {
  const lower = idea.toLowerCase();
  
  if (lower.includes('doubt') || lower.includes('ape')) {
    return {
      ticker: '$APE',
      name: 'Ape It Out',
      tagline: 'When in doubt, ape it out.',
      description: 'The ultimate conviction token for degens who never fade the impulse. Built for maximum speed, zero hesitation, and pure vibes on Solana.',
      lore: 'In the ancient scrolls of crypto lore, wisdom was simple: when all reason fails, trust the instinct. One frog embraced the ape.',
      vibeScore: 10,
      logoPrompt: 'A cool Pepe frog wearing aviator sunglasses and holding a diamond coffee mug in an abandoned bathroom',
      brandColors: ['#C6F250', '#12160C'],
      marketingHook: 'Dont overthink it. Just ape.',
    };
  }

  if (lower.includes('liquidity') || lower.includes('exit')) {
    return {
      ticker: '$EXIT',
      name: 'I Am The Liquidity',
      tagline: 'You are looking at the exit.',
      description: 'Why fear the dump when you are the floor? $EXIT celebrates the proud bagholders who hold the line until the next bull cycle arrives.',
      lore: 'Legend speaks of a frog who never sold, standing steadfast as green candles turned red and red candles turned into myth.',
      vibeScore: 9,
      logoPrompt: 'An exit sign illuminated in neon green glowing inside a dim vintage corridor with a Pepe silhouette',
      brandColors: ['#00FFA3', '#1F2417'],
      marketingHook: 'I did not get dumped on. I provided the exit.',
    };
  }

  if (lower.includes('candle')) {
    return {
      ticker: '$CANDLE',
      name: 'One More Candle',
      tagline: 'Just one more 15-minute bar.',
      description: 'The official sleep-deprivation currency of crypto Twitter. One more wick, one more green candle, one more dream.',
      lore: 'The screen blinked in the dark bathroom. 4:00 AM. Just one more candle, whispered the frog.',
      vibeScore: 10,
      logoPrompt: 'A massive glowing green candlestick towering over a vintage bathtub with neon reflections',
      brandColors: ['#22C55E', '#0A0D07'],
      marketingHook: 'Sleep is temporary, green wicks are forever.',
    };
  }

  if (lower.includes('financial') || lower.includes('advice')) {
    return {
      ticker: '$NFA',
      name: 'This Is Financial Advice',
      tagline: 'Totally not financial advice, but buy it.',
      description: 'The boldest disclaimer in Web3 history. 100% pure community momentum, 0% institutional interference.',
      lore: 'A legal team said no. The community said yes. Thus $NFA was born in the fires of decentralization.',
      vibeScore: 9,
      logoPrompt: 'A formal courtroom seal stamped with a laughing frog in a neon green suit',
      brandColors: ['#C6F250', '#273319'],
      marketingHook: 'Not financial advice. Unless it goes up.',
    };
  }

  // Dynamic Keyword Extraction for custom prompts
  const STOPWORDS = new Set(['a', 'an', 'the', 'that', 'this', 'these', 'those', 'it', 'its', 'i', 'my', 'we', 'our', 'you', 'your', 'me', 'us', 'on', 'in', 'at', 'for', 'to', 'of', 'with', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 'has', 'have', 'had', 'not', 'no', 'just', 'one', 'more', 'about', 'into', 'which', 'who', 'when', 'while', 'from']);
  const words = idea.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const keyword = (words.find(w => !STOPWORDS.has(w.toLowerCase())) || words[0] || 'MOON').toUpperCase();
  const symbol = keyword.slice(0, 6);
  const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  return {
    ticker: `$${symbol}`,
    name: capitalizedWords || 'Meme Coin',
    tagline: `We don't chase dreams, we mint them.`,
    description: `${capitalizedWords} is the ultimate meme token inspired by "${idea.trim()}". No roadmap. No promises. Just vibes, memes, and community on Solana.`,
    lore: `Born from a single line of conviction: "${idea.trim()}". Believers united to create a token that defies the ordinary.`,
    vibeScore: 10,
    logoPrompt: `A vibrant stylized emblem of ${capitalizedWords} with neon lime highlights and crypto aesthetic`,
    brandColors: ['#C6F250', '#161B12'],
    marketingHook: `The next viral wave on pump.fun is here.`,
  };
}

import { generateLogo } from './generate-logo.js';

/**
 * Generates a full pump.fun-ready token concept from a plain-language idea.
 * Automatically generates the AI mascot logo artwork as well.
 * @param {string} idea
 */
export async function generateToken(idea) {
  if (!idea || typeof idea !== 'string' || !idea.trim()) {
    throw new Error('An "idea" string is required.');
  }

  let llmResult;
  try {
    llmResult = await callMegaLLM(idea.trim());
  } catch (err) {
    console.warn('MegaLLM API call failed, falling back to smart concept generator:', err.message);
    llmResult = generateSmartConcept(idea.trim());
  }

  const tickerClean = normalizeTicker(llmResult.ticker);
  const nameClean = llmResult.name || 'Unnamed Token';
  const taglineClean = llmResult.tagline || '';
  const descriptionClean = llmResult.description || '';
  const loreClean = llmResult.lore || '';

  const params = new URLSearchParams();
  params.append('name', nameClean);
  params.append('symbol', tickerClean.replace('$', ''));
  params.append('ticker', tickerClean.replace('$', ''));
  params.append('description', taglineClean ? `${taglineClean}\n\n${descriptionClean}` : descriptionClean);

  // Automatically generate AI mascot logo
  let logoUrl = '';
  try {
    const logoData = await generateLogo({
      name: nameClean,
      ticker: tickerClean,
      logoPrompt: llmResult.logoPrompt || '',
      idea: idea.trim(),
    });
    logoUrl = logoData.logoUrl;
  } catch (err) {
    console.warn('Auto logo generation failed, using fallback badge:', err.message);
    logoUrl = '/pepe-badge.webp';
  }

  const token = {
    ticker: tickerClean,
    name: nameClean,
    tagline: taglineClean,
    description: descriptionClean,
    lore: loreClean,
    vibeScore: clampVibeScore(llmResult.vibeScore),
    pumpUrl: PUMP_FUN_CREATE_URL,
    generatedFrom: idea.trim(),
    logoPrompt: llmResult.logoPrompt || '',
    logoUrl: logoUrl,
    brandColors: Array.isArray(llmResult.brandColors) && llmResult.brandColors.length >= 2
      ? llmResult.brandColors.slice(0, 2)
      : ['#FF5733', '#1A1D20'],
    marketingHook: llmResult.marketingHook || '',
  };

  return token;
}

