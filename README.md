<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:4a0080,100:00d9ff&height=200&section=header&text=Career%20Coach%20MVP&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=AI%20Hiring%20Panel%20Verdict&descSize=20&descAlignY=55" />
</p>

<p align="center">
  <strong>Multi-agent resume analysis with simulated hiring committee</strong>
</p>

<p align="center">
  <em>"Let the invention be hidden in your vision"</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.1.0-00d9ff?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude-Hiring_Manager-cc785c?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude" />
  <img src="https://img.shields.io/badge/Grok-Tech_Lead-000000?style=for-the-badge&logo=x&logoColor=white" alt="Grok" />
  <img src="https://img.shields.io/badge/GPT--4-HR_Culture-412991?style=for-the-badge&logo=openai&logoColor=white" alt="GPT-4" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Metaventions_AI-Architected_Intelligence-1a1a2e?style=for-the-badge" alt="Metaventions AI" />
</p>

---

## Summary • Architecture • Engines • Quick Start • Features • Contact

---

## Executive Summary

**Career Coach MVP** simulates a real hiring committee to evaluate your resume against job descriptions. Three AI agents—each powered by different models—provide independent assessments, then reach a **consensus verdict**.

- **Hiring Manager** (Claude) — Strategic fit, leadership potential, career trajectory
- **Tech Lead** (Grok/Gemini) — Technical depth, implementation experience, skill validation
- **HR/Culture** (GPT-4) — Culture alignment, soft skills, team dynamics

The **Nexus Engine** pre-analyzes resumes using neuro-symbolic algorithms to extract competency depth scores and infer implicit skills before the agents deliberate.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CAREER COACH MVP                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │   RESUME    │     │     JOB     │     │   CULTURE   │                  │
│   │   INPUT     │     │ DESCRIPTION │     │  SELECTOR   │                  │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                  │
│          │                   │                   │                          │
│          └───────────────────┼───────────────────┘                          │
│                              ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      NEXUS ENGINE                                    │  │
│   │  ┌─────────────────────┐    ┌────────────────────────┐              │  │
│   │  │ Competency Depth    │    │ Implicit Skill         │              │  │
│   │  │ Scoring (1-5)       │    │ Inference              │              │  │
│   │  │                     │    │                        │              │  │
│   │  │ ARCHITECTED (5)     │    │ "Built React apps"     │              │  │
│   │  │ LED (4)             │    │ → Infers: Jest, Git,   │              │  │
│   │  │ IMPLEMENTED (3)     │    │   CI/CD, Code Review   │              │  │
│   │  │ USED (2)            │    │                        │              │  │
│   │  │ EXPOSED (1)         │    │                        │              │  │
│   │  └─────────────────────┘    └────────────────────────┘              │  │
│   └──────────────────────────────┬──────────────────────────────────────┘  │
│                                  ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                   MULTI-AGENT EVALUATION                             │  │
│   │                                                                      │  │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │  │
│   │   │   HIRING     │   │    TECH      │   │     HR       │            │  │
│   │   │   MANAGER    │   │    LEAD      │   │   CULTURE    │            │  │
│   │   │              │   │              │   │              │            │  │
│   │   │  ┌────────┐  │   │  ┌────────┐  │   │  ┌────────┐  │            │  │
│   │   │  │ Claude │  │   │  │  Grok  │  │   │  │ GPT-4  │  │            │  │
│   │   │  └────────┘  │   │  └────────┘  │   │  └────────┘  │            │  │
│   │   │              │   │              │   │              │            │  │
│   │   │ • Strategy   │   │ • Technical  │   │ • Culture    │            │  │
│   │   │ • Leadership │   │ • Code depth │   │ • Soft skills│            │  │
│   │   │ • Trajectory │   │ • Systems    │   │ • Team fit   │            │  │
│   │   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘            │  │
│   │          │                  │                  │                     │  │
│   │          └──────────────────┼──────────────────┘                     │  │
│   │                             ▼                                        │  │
│   │                    ┌────────────────┐                                │  │
│   │                    │   CONSENSUS    │                                │  │
│   │                    │    VERDICT     │                                │  │
│   │                    │                │                                │  │
│   │                    │ STRONG HIRE    │                                │  │
│   │                    │ HIRE           │                                │  │
│   │                    │ LEAN HIRE      │                                │  │
│   │                    │ LEAN NO HIRE   │                                │  │
│   │                    │ NO HIRE        │                                │  │
│   │                    └────────────────┘                                │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/Dicoangelo/career-coach-mvp.git
cd career-coach-mvp

# Install
npm install

# Configure API Keys (create .env.local)
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
XAI_API_KEY=your_grok_key        # Optional: Falls back to Gemini
GEMINI_API_KEY=your_gemini_key   # Optional: Falls back to Claude

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Core Engines

### 1. Nexus Engine (lib/engines/nexus.ts)
**Neuro-Symbolic Resume Graph Core — Pre-analysis before agent evaluation.**

| Algorithm | Purpose |
|-----------|---------|
| **Competency Depth Scoring** | Maps action verbs to 1-5 skill levels |
| **Implicit Skill Inference** | Detects skills not explicitly listed |

**Depth Levels**:

| Level | Score | Example Verbs |
|-------|-------|---------------|
| ARCHITECTED | 5 | designed, pioneered, invented, founded |
| LED | 4 | directed, managed, spearheaded, scaled |
| IMPLEMENTED | 3 | built, developed, engineered, deployed |
| USED | 2 | applied, utilized, configured, maintained |
| EXPOSED | 1 | familiar, learned, assisted, participated |

### 2. Multi-Agent Evaluation (lib/engines/multi-agent-eval.ts)
**Simulated Hiring Committee — Three perspectives, one verdict.**

| Agent | Model | Focus Areas |
|-------|-------|-------------|
| **Hiring Manager** | Claude (Anthropic) | Strategic fit, leadership, career growth |
| **Tech Lead** | Grok (xAI) / Gemini | Technical depth, system design, code quality |
| **HR/Culture** | GPT-4 (OpenAI) | Culture alignment, communication, team dynamics |

Each agent receives:
- Full job description
- Resume text
- Nexus Engine pre-analysis (competency scores, inferred skills, flags)

### 3. Chameleon Engine (lib/engines/chameleon.ts)
**Adaptive response formatting based on context.**

---

## Features

| Feature | Description |
|---------|-------------|
| **Analyze Tab** | Paste resume + job description → Get panel verdict |
| **Track Tab** | Kanban board for job application pipeline |
| **Stats Tab** | Analytics across your applications |
| **Verdict Cards** | Visual feedback from each agent with strengths/concerns |
| **Culture Selector** | Match company culture type for HR agent context |
| **Multi-Provider** | Automatic fallback between AI providers |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **AI** | Claude, GPT-4, Grok, Gemini |
| **Icons** | Lucide React |

---

## Project Structure

```
career-coach-mvp/
├── app/
│   ├── api/                    # API routes
│   ├── components/
│   │   ├── AnalyzeTab.tsx      # Resume analysis interface
│   │   ├── TrackTab.tsx        # Job tracking kanban
│   │   ├── StatsTab.tsx        # Application analytics
│   │   ├── VerdictCard.tsx     # Agent feedback display
│   │   ├── JobInput.tsx        # Job description input
│   │   ├── ResumeInput.tsx     # Resume text input
│   │   └── CultureSelector.tsx # Company culture picker
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── ai/
│   │   ├── model-gateway.ts    # Multi-provider AI client
│   │   └── prompts.ts          # Agent prompt templates
│   ├── engines/
│   │   ├── nexus.ts            # Competency depth scoring
│   │   ├── multi-agent-eval.ts # Hiring committee simulation
│   │   └── chameleon.ts        # Adaptive formatting
│   ├── store.ts                # Zustand state
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Helpers
└── package.json
```

---

## Verdict Scale

| Verdict | Meaning |
|---------|---------|
| **STRONG HIRE** | Exceptional match, all agents aligned |
| **HIRE** | Solid candidate, meets requirements |
| **LEAN HIRE** | Potential with reservations |
| **LEAN NO HIRE** | Significant gaps identified |
| **NO HIRE** | Poor fit for role |

---

## Related Projects

| Project | Description |
|---------|-------------|
| [CareerCoachAntigravity](https://github.com/Dicoangelo/CareerCoachAntigravity) | Full career governance system |
| [OS-App](https://github.com/Dicoangelo/OS-App) | Sovereign AI Operating System |
| [ResearchGravity](https://github.com/Dicoangelo/ResearchGravity) | Research session framework |

---

## Roadmap

- [x] ~~Nexus Engine — Competency scoring~~
- [x] ~~Multi-agent evaluation system~~
- [x] ~~Job tracking kanban~~
- [ ] Resume optimization suggestions
- [ ] Interview question generation
- [ ] Salary negotiation insights
- [ ] LinkedIn profile analysis
- [ ] Application email generator

---

## License

MIT License — See [LICENSE](LICENSE)

---

## Contact

**Metaventions AI**  
Dico Angelo  
dicoangelo@metaventionsai.com

<p align="center">
  <a href="https://metaventionsai.com">
    <img src="https://img.shields.io/badge/Metaventions_AI-Website-00d9ff?style=for-the-badge" alt="Website" />
  </a>
  <a href="https://github.com/Dicoangelo">
    <img src="https://img.shields.io/badge/GitHub-Dicoangelo-1a1a2e?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:4a0080,100:00d9ff&height=100&section=footer" />
</p>
