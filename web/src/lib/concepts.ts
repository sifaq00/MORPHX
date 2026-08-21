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