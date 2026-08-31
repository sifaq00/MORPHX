import type { Token } from '../pages/GeneratePage';

const KEY = 'pounce-concepts';

export function loadConcepts(): Token[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConcept(token: Token): Token[] {
  const all = loadConcepts();
  const next = [token, ...all.filter((t) => t.generatedFrom !== token.generatedFrom)].slice(0, 20);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full or unavailable — ignore, app keeps working
  }
  return next;
}

export function deleteConcept(generatedFrom: string): Token[] {
  const next = loadConcepts().filter((t) => t.generatedFrom !== generatedFrom);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function formatPitchDeck(c: Token): string {
  const sections: string[] = [];

  // 1. Identity & Tagline
  sections.push(`🚀 ${c.name} (${c.ticker})`);
  if (c.tagline) {
    sections.push(`"${c.tagline}"`);
  }

  // 2. Description
  if (c.description) {
    sections.push(`\n📝 Description:\n${c.description}`);
  }

  // 3. Lore
  if (c.lore) {
    sections.push(`\n📜 Lore:\n${c.lore}`);
  }

  // 4. Marketing Hook & Vibe Score
  const meta: string[] = [];
  if (c.marketingHook) meta.push(`⚡ Marketing Hook: ${c.marketingHook}`);
  if (c.vibeScore) meta.push(`🔥 Vibe Score: ${c.vibeScore}/10`);
  if (c.brandColors && c.brandColors.length > 0) meta.push(`🎨 Brand Colors: ${c.brandColors.join(', ')}`);
  if (meta.length > 0) {
    sections.push(`\n` + meta.join('\n'));
  }

  // 5. Logo Prompt & Image URL
  if (c.logoPrompt) {
    sections.push(`\n🎨 Logo / Mascot Prompt:\n"${c.logoPrompt}"`);
  }
  if (c.logoUrl && !c.logoUrl.startsWith('/')) {
    sections.push(`🖼️ Mascot Artwork: ${c.logoUrl}`);
  }

  // 6. Direct Launch URL
  if (c.pumpUrl) {
    sections.push(`\n🔗 Launch on pump.fun:\n${c.pumpUrl}`);
  }

  return sections.join('\n');
}