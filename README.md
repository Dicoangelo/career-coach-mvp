# Career Coach MVP

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**AI-Powered Hiring Panel Simulation**

*Multi-agent resume analysis with Nexus Engine intelligence*

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Configuration](#configuration) • [API Reference](#api-reference)

</div>

---

## Overview

Career Coach MVP simulates a **3-person hiring committee** that evaluates your resume against any job description. Each AI agent brings a different perspective:

| Agent | Role Simulated | Focus Area |
|-------|---------------|------------|
| **Hiring Manager** | VP of Partnerships | Business impact, revenue outcomes, strategic alignment |
| **Tech Lead** | Principal Engineer | Technical depth, architecture decisions, systems thinking |
| **HR/Culture** | Senior HRBP | Cultural fit, collaboration evidence, growth mindset |

The system delivers:
- **Match Score** (0-100) with weighted algorithmic + committee analysis
- **Verdict per agent** (HIRE / INTERVIEW / NO_HIRE)
- **Specific concerns and praises** from each perspective
- **Culture-aware resume rewrites** via the Chameleon Engine

---

## Features

### Nexus Engine (Neuro-Symbolic Resume Graph)

Pattern-based skill extraction and competency scoring:

- **Competency Depth Scoring (1-5)**: Detects action verb patterns to infer skill mastery
  - Level 5 (ARCHITECTED): "architected", "designed", "pioneered", "invented"
  - Level 4 (LED): "led", "directed", "managed", "owned", "scaled"
  - Level 3 (IMPLEMENTED): "built", "developed", "deployed", "launched"
  - Level 2 (USED): "used", "applied", "leveraged", "configured"
  - Level 1 (EXPOSED): "familiar", "exposed", "participated", "assisted"

- **Implicit Skill Inference**: Detects hidden skills from context
  - "partnership portfolio" → Contract Negotiation (95%), Executive Stakeholder Management
  - "microservices" → Domain-Driven Design (90%), API Design, Container Orchestration
  - "P&L ownership" → Financial Accountability (95%), Budget Ownership

### Multi-Agent Hiring Panel

Three AI agents evaluate your resume in parallel:

```
Resume + Job Description
         ↓
┌────────────────────────────────────────────────┐
│            Nexus Engine Analysis               │
│  • Extract skills (explicit + implicit)        │
│  • Score competency depth (1-5)                │
│  • Calculate consensus match score             │
└────────────────────────────────────────────────┘
         ↓
┌─────────────┬─────────────┬─────────────┐
│   Hiring    │   Tech      │    HR/      │
│   Manager   │   Lead      │   Culture   │
│  (Claude)   │  (Grok/     │  (OpenAI)   │
│             │   Gemini)   │             │
└──────┬──────┴──────┬──────┴──────┬──────┘
       └─────────────┴─────────────┘
                     ↓
         Weighted Score Calculation
         60% Nexus + 40% Committee
```

### Chameleon Engine (Culture-Aware Rewrites)

Adapts your resume bullets to target company culture:

| Archetype | Label | Focus | Example Transform |
|-----------|-------|-------|-------------------|
| **speed** | Velocity Culture | Fast-moving startups | "managed" → "accelerated" |
| **safety** | Reliability Culture | Governance, compliance | "fast" → "reliable" |
| **creative** | Innovation Culture | Zero-to-one builders | "optimized" → "invented" |
| **ecosystem** | Scale Culture | Network effects, partnerships | "managed" → "orchestrated across partners" |

### Job Tracking (Kanban Board)

Track applications through your pipeline:
- **Saved** → **Applied** → **Interview** → **Offer**
- Conversion funnel metrics (response rate, interview-to-offer %)
- Attach analysis results to each application

---

## Quick Start

### Prerequisites

- Node.js 18+
- At least one AI provider API key (Anthropic recommended)

### Installation

```bash
git clone https://github.com/Dicoangelo/career-coach-mvp.git
cd career-coach-mvp
npm install
```

### Configuration

Create `.env.local` with your API keys:

```env
# Required (at least one)
ANTHROPIC_API_KEY=sk-ant-...

# Optional (enables multi-provider)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
XAI_API_KEY=xai-...
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **UI** | React 18, Tailwind CSS, Lucide Icons |
| **State** | Zustand 5 |
| **AI Providers** | Anthropic (Claude), OpenAI (GPT-4o), Google (Gemini), xAI (Grok) |
| **Type Safety** | TypeScript 5 |

### Directory Structure

```
career-coach-mvp/
├── app/
│   ├── api/
│   │   ├── analyze/      # POST - Resume analysis endpoint
│   │   └── jobs/         # CRUD - Job tracking
│   ├── components/
│   │   ├── AnalyzeTab.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── TrackTab.tsx
│   │   ├── StatsTab.tsx
│   │   └── CultureSelector.tsx
│   ├── page.tsx
│   └── layout.tsx
├── lib/
│   ├── engines/
│   │   ├── nexus.ts          # Neuro-Symbolic Resume Graph
│   │   ├── multi-agent-eval.ts   # Hiring committee
│   │   └── chameleon.ts      # Culture-aware rewrites
│   ├── ai/
│   │   ├── model-gateway.ts  # Multi-provider routing
│   │   └── prompts.ts        # Agent prompt templates
│   ├── types.ts
│   ├── store.ts              # Zustand state
│   └── utils.ts
└── package.json
```

### AI Model Gateway

Automatic provider detection and fallback:

```typescript
// Provider detection by API key prefix
const PROVIDER_PATTERNS = {
  anthropic: /^sk-ant-/,
  openai: /^sk-/,
  google: /^AIza/,
  xai: /^xai-/,
};

// Fallback chains per provider
const FALLBACK_MODELS = {
  anthropic: ["claude-sonnet-4-20250514", "claude-3-5-sonnet", "claude-3-haiku"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  google: ["gemini-2.0-flash", "gemini-1.5-flash"],
  xai: ["grok-3", "grok-3-mini"],
};
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes* | Anthropic Claude API key |
| `OPENAI_API_KEY` | No | OpenAI API key (enables GPT-4o) |
| `GEMINI_API_KEY` | No | Google AI key (enables Gemini) |
| `XAI_API_KEY` | No | xAI key (enables Grok) |

*At least one AI provider key is required

### Agent-to-Provider Mapping

| Agent | Default Provider | Fallback Chain |
|-------|-----------------|----------------|
| Hiring Manager | Anthropic (Claude) | OpenAI → Google |
| Tech Lead | xAI (Grok) | Google → Anthropic |
| HR/Culture | OpenAI (GPT-4o) | Anthropic → Google |

---

## API Reference

### POST `/api/analyze`

Analyze a resume against a job description.

**Request:**
```typescript
interface AnalyzeRequest {
  resumeText: string;      // Full resume text
  jobDescription: string;  // Target job description
  jobTitle?: string;       // e.g., "Senior Engineer"
  company?: string;        // e.g., "Acme Corp"
  archetype?: Archetype;   // "speed" | "safety" | "creative" | "ecosystem"
}
```

**Response:**
```typescript
interface AnalyzeResponse {
  success: boolean;
  result?: {
    matchScore: number;              // 0-100 weighted score
    matchTier: MatchTier;            // "STRONG_MATCH" | "MODERATE_MATCH" | "WEAK_MATCH" | "NO_MATCH"
    committeeFeedback: AgentFeedback[];  // 3 agent evaluations
    nexusAnalysis: NexusAnalysis;    // Skill extraction results
    chameleonMetrics?: ChameleonMetrics[];  // Rewrites if archetype selected
  };
  error?: string;
}
```

**Match Score Calculation:**
```
matchScore = (nexusAnalysis.consensusScore * 0.6) + (agentAverageScore * 0.4)
```

### GET/POST `/api/jobs`

CRUD operations for job tracking.

---

## Types Reference

### Competency Levels
```typescript
type CompetencyLevel = 'EXPOSED' | 'USED' | 'IMPLEMENTED' | 'LED' | 'ARCHITECTED';
```

### Confidence Levels
```typescript
type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'SPECULATIVE';
```

### Match Tiers
```typescript
type MatchTier = 'STRONG_MATCH' | 'MODERATE_MATCH' | 'WEAK_MATCH' | 'NO_MATCH';
```

### Agent Verdicts
```typescript
type Verdict = 'HIRE' | 'INTERVIEW' | 'NO_HIRE';
```

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint
npm run lint
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Production

Set all API keys in your hosting platform's environment configuration.

---

## License

MIT

---

## Part of the D-Ecosystem

<div align="center">

Career Coach MVP is part of the **Antigravity Ecosystem** by [Metaventions AI](https://metaventionsai.com)

[OS-App](https://github.com/Dicoangelo/OS-App) • [ResearchGravity](https://github.com/Dicoangelo/ResearchGravity) • [The-Decosystem](https://github.com/Dicoangelo/The-Decosystem)

</div>
