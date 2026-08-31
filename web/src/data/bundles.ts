export type BundleCard = {
  id: string;
  namespace: string;
  name: string;
  description: string;
  tags: string[];
  hot?: boolean;
  stars: number;
};

// Sample/demo content — illustrative bundle listings, not live install data.
export const BUNDLES: BundleCard[] = [
  {
    id: 'token-launcher',
    namespace: 'morphx/bundles',
    name: 'token-launcher',
    description:
      'Full token launch workflow. Includes: generate → audit → narrative → launch URL. One bundle, four skills configured to work together.',
    tags: ['forge-generate', 'forge-audit', 'forge-narrative', 'forge-launch'],
    hot: true,
    stars: 3100,
  },
  {
    id: 'meme-factory',
    namespace: 'morphx/bundles',
    name: 'meme-factory',
    description:
      'Meme token creation pipeline. Competitive scan → differentiated concept → lore → launch thread. For builders who ship fast.',
    tags: ['forge-generate', 'forge-narrative', 'competitor-scan'],
    stars: 1700,
  },
  {
    id: 'dev-culture-pack',
    namespace: 'morphx/bundles',
    name: 'dev-culture-pack',
    description:
      'Developer meme token workflow. Repo scouting → dev-culture token generation → crypto-dev thread. Built for the technical degen.',
    tags: ['dev-meme-token', 'forge-generate', 'forge-narrative'],
    stars: 720,
  },
  {
    id: 'full-stack-launch',
    namespace: 'morphx/bundles',
    name: 'full-stack-launch',
    description:
      'Everything. Competitor scan → generate → audit → image prompts → narrative → reply strategy. The most complete launch bundle.',
    tags: ['forge-generate', 'forge-audit', 'forge-image-prompt', 'forge-narrative'],
    stars: 560,
  },
  {
    id: 'robot-companion-pack',
    namespace: 'morphx/bundles',
    name: 'robot-companion-pack',
    description:
      'Full lore and launch pack for robot-companion token concepts. Companion narrative + image context + launch copy.',
    tags: ['robot-companion-lore', 'forge-generate', 'forge-image-prompt'],
    stars: 445,
  },
];
