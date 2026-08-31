export type McpServerCard = {
  id: string;
  namespace: string;
  name: string;
  description: string;
  tools: string[];
  hot?: boolean;
  stars: number;
};

// Sample/demo content describing the kind of MCP server listings this
// directory could host. Not a live registry.
export const MCP_SERVERS: McpServerCard[] = [
  {
    id: 'morphx-mcp',
    namespace: 'morphx/mcp',
    name: 'morphx-mcp',
    description:
      'Connect Claude Code to MORPHX. Generate token concepts, get a vibe score, and receive a pre-filled launch URL, all from your terminal.',
    tools: ['forge_generate', 'forge_trending', 'forge_launch'],
    hot: true,
    stars: 2400,
  },
  {
    id: 'solana-tracker',
    namespace: 'community/mcp',
    name: 'solana-tracker',
    description: 'Read Solana on-chain token data via public RPC. Get holder counts, price history, and transaction volume for any SPL token.',
    tools: ['get_token', 'get_holders', 'get_volume'],
    stars: 891,
  },
  {
    id: 'pump-dashboard',
    namespace: 'community/mcp',
    name: 'pump-dashboard',
    description: 'Real-time pump.fun dashboard data. Token launch feed, bonding curve progress, graduation alerts, and volume heatmaps.',
    tools: ['get_feed', 'get_bonding_progress', 'get_graduating'],
    stars: 340,
  },
];
