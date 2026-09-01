<div align="center">

# MORPHX

**MCP Server & AI Agent Terminal for pump.fun**

*Generate token concepts, analyze vibe scores, and deploy directly from your terminal.*

[![Chain](https://img.shields.io/badge/chain-Solana%20·%20pump.fun-14F195?style=flat-square&labelColor=0A0F0C)](https://pump.fun)
[![Runtime](https://img.shields.io/badge/runtime-Node.js%20·%20TypeScript%20·%20React-E9E4D6?style=flat-square&labelColor=0A0F0C)](#tech-stack)
[![MCP](https://img.shields.io/badge/MCP-server-E0A82E?style=flat-square&labelColor=0A0F0C)](#mcp-server)
[![Website](https://img.shields.io/badge/website-morphx.fun-38C172?style=flat-square&labelColor=0A0F0C)](https://morphx.fun/)
[![X](https://img.shields.io/badge/X-@morphxlabs-000000?style=flat-square&logo=x&labelColor=0A0F0C)](https://x.com/morphxlabs?s=11)

</div>

---

MORPHX is a Model Context Protocol (MCP) server and interactive suite that connects AI assistants like Claude Code directly to pump.fun. It enables autonomous generation of token concepts, vibe scoring, market trend analysis, and seamless terminal-to-launch workflows with zero key custody.

> *"The protocol that will launch a million tokens needed its own token first."* — **$MORPHX**

---

## Features & Tools

MORPHX equips AI agents with specialized tools to screen and deploy on pump.fun:

| Tool | Role & Description |
|---|---|
| **`pump_generate`** | Autonomous concept generation — turns plain English prompts into tickers, taglines, deep lore, vibe scores, and launch parameters. |
| **`pump_trending`** | Real-time market scanner — fetches trending pump.fun tokens, volume spikes, and market cap metrics. |
| **`pump_launch`** | Pre-filled launch URL builder — generates instant, zero-custody deployment links ready for browser execution. |

---

## Quickstart & Installation

### Option 1: Fast Install via npx

```bash
npx @morphx/server install
```

Or add directly as a dependency:

```bash
npm install @morphx/server
```

### Option 2: Connect to Claude Code / MCP Clients

Add to your `CLAUDE.md`:

```yaml
mcp_servers:
  - name: "morphx"
    url: "https://mcp.morphx.fun/sse"
    type: http
```

Or add `.mcp.json` in your repository root:

```json
{
  "mcpServers": {
    "morphx": {
      "type": "http",
      "url": "https://mcp.morphx.fun/sse"
    }
  }
}
```

---

## Example Usage

In your terminal connected with Claude Code:

```text
claude > Use pump_generate to make a token about AI agents that dream
```

**Response Output:**

```json
{
  "ticker": "$MORPHX",
  "name": "MORPHX",
  "tagline": "agents don't sleep. they process.",
  "description": "While you sleep, $MORPHX agents are running. Processing market data, writing strategies, executing trades. The first token for the agents that never clock out.",
  "lore": "Born in a data center at 3am. Never been offline.",
  "vibeScore": 9,
  "pumpUrl": "https://pump.fun/create?name=MORPHX&symbol=MORPHX&description=..."
}
```

---

## Local Development & Setup

```bash
# Clone the repository
git clone https://github.com/sifaq00/MORPHX
cd MORPHX

# Configure environment variables
cp web/.env.example web/.env
# Add your ANTHROPIC_API_KEY to web/.env

# Install dependencies and start dev server
npm install
npm run dev
```

* Vite runs locally at `http://localhost:5173`.
* `POST /api/generate` is handled by Vite dev server locally, and by `web/api/generate.js` when deployed to Vercel.

---

## Deploy Web to Vercel

1. Import this repository in Vercel.
2. Set **Root Directory** to `web`.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Configure Environment Variable: `ANTHROPIC_API_KEY=...`
6. Click **Deploy**.

---

## Repository Structure

```text
MORPHX/
├── web/                       # Frontend web app (React + Vite + Tailwind/CSS)
│   ├── index.html
│   ├── vite.config.js
│   ├── api/                   # Serverless API routes
│   └── src/                   # React components & MCP directory data
├── packages/                  # MCP server packages
├── pounce-daemon-dev-brief/   # Documentation & project spec briefs
├── examples/                  # Integration examples
└── README.md
```

---

## License

[MIT](LICENSE)
