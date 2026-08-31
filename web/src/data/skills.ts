export type SkillCard = {
  id: string;
  namespace: string;
  name: string;
  description: string;
  tags: string[];
  hot?: boolean;
  official?: boolean;
  stars: number;
  category: 'tokens' | 'dev' | 'social' | 'image' | 'lore';
};

// Sample/demo directory content illustrating the kind of Claude Code skills
// a token-builder ecosystem could offer. Numbers are illustrative, not live data.
export const SKILLS: SkillCard[] = [
  {
    id: 'forge-generate',
    namespace: 'morphx/tools',
    name: 'forge-generate',
    description: 'Generate a token from any idea. Returns ticker, name, lore, description, vibe score, and a launch URL.',
    tags: ['tokens', 'generator'],
    hot: true,
    official: true,
    stars: 2400,
    category: 'tokens',
  },
  {
    id: 'forge-narrative',
    namespace: 'morphx/tools',
    name: 'forge-narrative',
    description: 'Write a complete launch thread for any token. 7-post structure: hook, lore, credibility layer, proof, CTA.',
    tags: ['narrative', 'social'],
    official: true,
    stars: 1800,
    category: 'social',
  },
  {
    id: 'forge-audit',
    namespace: 'morphx/tools',
    name: 'forge-audit',
    description: 'Audit a token description for quality: hook strength, clarity, cultural grounding, and best-practice fit.',
    tags: ['tokens', 'quality'],
    official: true,
    stars: 890,
    category: 'tokens',
  },
  {
    id: 'forge-image-prompt',
    namespace: 'morphx/tools',
    name: 'forge-image-prompt',
    description: 'Generate optimized image prompts for a token logo and banner, formatted for common AI image tools.',
    tags: ['image', 'tokens'],
    stars: 720,
    category: 'image',
  },
  {
    id: 'dev-meme-token',
    namespace: 'morphx/collections',
    name: 'dev-meme-token',
    description: 'Generate tokens from developer culture: changelogs, ship-it energy, standup jokes. Built for the technical degen.',
    tags: ['tokens', 'dev', 'lore'],
    stars: 560,
    category: 'dev',
  },
  {
    id: 'claude-md-forge',
    namespace: 'morphx/dev-tools',
    name: 'claude-md-forge',
    description: 'Optimize your CLAUDE.md file for MORPHX workflows. Adds tool configs, skill references, and launch shortcuts.',
    tags: ['dev', 'tokens'],
    stars: 430,
    category: 'dev',
  },
  {
    id: 'mcp-server-scaffold',
    namespace: 'morphx/dev-tools',
    name: 'mcp-server-scaffold',
    description: 'Scaffold a new MCP server from scratch in TypeScript. SSE transport, tool definitions, schema validation.',
    tags: ['dev'],
    stars: 310,
    category: 'dev',
  },
  {
    id: 'robot-companion-lore',
    namespace: 'morphx/collections',
    name: 'robot-companion-lore',
    description: 'A full lore package for robot-companion token concepts, covering backstory, tone, and narrative hooks.',
    tags: ['lore', 'narrative'],
    stars: 178,
    category: 'lore',
  },
];
