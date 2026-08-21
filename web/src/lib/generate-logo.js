// web/src/lib/generate-logo.js
//
// Fast, robust AI Mascot & Token Logo Generator for Pump.fun Memecoins.
// Generates iconic vector/sticker mascot artwork with automatic sub-second fallback.

export function buildMascotPrompt({ name, ticker, logoPrompt, idea }) {
  const cleanTicker = (ticker || 'MEME').replace('$', '');
  const tokenName = name || 'Meme Token';
  const cleanSubject = (logoPrompt || idea || 'crypto mascot')
    .replace(/["\n\r\t]/g, ' ')
    .slice(0, 80);

  return `cute crypto sticker mascot for ${tokenName} ${cleanTicker}, ${cleanSubject}, bold vector graphic badge, dark background, 4k`;
}

/**
 * Generate a fast, reliable token mascot logo URL.
 * Uses Pollinations turbo with instant DiceBear robot/mascot fallback.
 */
export async function generateLogo({ name, ticker, logoPrompt, idea, seed }) {
  const cleanTicker = (ticker || 'MEME').replace('$', '');
  const finalSeed = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const prompt = buildMascotPrompt({ name, ticker, logoPrompt, idea });

  // 1. Primary: Pollinations Turbo endpoint (clean & encoded)
  const encodedPrompt = encodeURIComponent(prompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=400&nologo=true&seed=${finalSeed}&model=turbo`;

  // 2. High-speed, 100% reliable mascot fallback (DiceBear Bottts/Mascot SVG/PNG)
  const fallbackUrl = `https://api.dicebear.com/9.x/bottts/png?seed=${encodeURIComponent(cleanTicker + '-' + finalSeed)}&backgroundColor=0e140a&size=400`;

  return {
    logoUrl: pollinationsUrl,
    fallbackUrl,
    prompt,
    seed: finalSeed,
  };
}
