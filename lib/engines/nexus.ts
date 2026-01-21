/**
 * Nexus Engine - Neuro-Symbolic Resume Graph Core
 *
 * Implements:
 * - Algorithm 1: Competency Depth Scoring (1-5 levels)
 * - Algorithm 2: Implicit Skill Inference (pattern-based)
 */

import type {
  NexusAnalysis,
  InferredSkill,
  CompetencyScore,
  CompetencyLevel,
  ConfidenceLevel,
} from "../types";

// ============================================================================
// ALGORITHM 1: COMPETENCY DEPTH SCORING
// ============================================================================

const DEPTH_VERBS: Record<number, string[]> = {
  5: [
    "architected",
    "designed",
    "founded",
    "pioneered",
    "invented",
    "created",
    "innovated",
    "envisioned",
  ],
  4: [
    "led",
    "directed",
    "managed",
    "owned",
    "drove",
    "spearheaded",
    "orchestrated",
    "oversaw",
    "scaled",
  ],
  3: [
    "built",
    "developed",
    "implemented",
    "engineered",
    "executed",
    "delivered",
    "launched",
    "deployed",
  ],
  2: [
    "used",
    "applied",
    "utilized",
    "leveraged",
    "worked with",
    "operated",
    "configured",
    "maintained",
  ],
  1: [
    "familiar",
    "exposed",
    "aware",
    "participated",
    "assisted",
    "supported",
    "learned",
    "studied",
  ],
};

const DEPTH_TO_LEVEL: Record<number, CompetencyLevel> = {
  1: "EXPOSED",
  2: "USED",
  3: "IMPLEMENTED",
  4: "LED",
  5: "ARCHITECTED",
};

function scoreCompetencyDepth(skill: string, context: string): CompetencyScore {
  const textLower = context.toLowerCase();
  const skillLower = skill.toLowerCase();

  let highestDepth = 1;
  const evidence: string[] = [];

  for (const [depthStr, verbs] of Object.entries(DEPTH_VERBS)) {
    const depth = parseInt(depthStr);
    for (const verb of verbs) {
      const verbPattern = new RegExp(`${verb}[\\s\\w]{0,20}${skillLower}`, "i");
      const skillVerbPattern = new RegExp(
        `${skillLower}[\\s\\w]{0,10}${verb}`,
        "i"
      );

      if (verbPattern.test(textLower) || skillVerbPattern.test(textLower)) {
        if (depth > highestDepth) {
          highestDepth = depth;
          evidence.push(`"${verb}" indicates ${DEPTH_TO_LEVEL[depth]} level`);
        }
      }
    }
  }

  const sentences = context.split(/[.!?]+/);
  const relevantSentence = sentences.find((s) =>
    s.toLowerCase().includes(skillLower)
  );
  if (relevantSentence) {
    evidence.push(relevantSentence.trim().substring(0, 150));
  }

  return {
    skill,
    level: DEPTH_TO_LEVEL[highestDepth],
    score: highestDepth,
    evidence,
  };
}

// ============================================================================
// ALGORITHM 2: IMPLICIT SKILL INFERENCE
// ============================================================================

const INFERENCE_PATTERNS: Record<string, Array<[string, number]>> = {
  "partnership portfolio": [
    ["Contract Negotiation", 0.95],
    ["Executive Stakeholder Management", 0.95],
    ["Revenue Forecasting", 0.9],
  ],
  "partner-sourced pipeline": [
    ["Partner Enablement", 0.95],
    ["Co-selling", 0.9],
    ["Pipeline Attribution", 0.9],
  ],
  tcv: [
    ["Enterprise Sales Cycles", 0.95],
    ["Multi-year Contracts", 0.9],
  ],
  arr: [
    ["SaaS Metrics", 0.9],
    ["Recurring Revenue Models", 0.85],
  ],
  architected: [
    ["System Design", 0.95],
    ["Technical Documentation", 0.85],
  ],
  microservices: [
    ["Domain-Driven Design", 0.9],
    ["API Design", 0.9],
    ["Container Orchestration", 0.8],
  ],
  "data pipeline": [
    ["ETL Design", 0.95],
    ["Data Quality", 0.85],
  ],
  "ci/cd": [
    ["DevOps", 0.95],
    ["Automation", 0.9],
    ["Release Management", 0.85],
  ],
  kubernetes: [
    ["Container Orchestration", 0.95],
    ["Cloud Native", 0.9],
  ],
  terraform: [
    ["Infrastructure as Code", 0.95],
    ["Cloud Provisioning", 0.9],
  ],
  "led team": [
    ["Performance Management", 0.9],
    ["Resource Allocation", 0.85],
    ["Sprint Planning", 0.8],
  ],
  "cross-functional": [
    ["Stakeholder Alignment", 0.9],
    ["Collaboration", 0.95],
  ],
  headcount: [
    ["Hiring", 0.95],
    ["Team Building", 0.9],
  ],
  "p&l": [
    ["Financial Accountability", 0.95],
    ["Budget Ownership", 0.95],
  ],
  "machine learning": [
    ["Python", 0.85],
    ["Data Science", 0.9],
    ["Statistical Analysis", 0.85],
  ],
  llm: [
    ["Prompt Engineering", 0.9],
    ["NLP", 0.85],
    ["AI Integration", 0.9],
  ],
  gtm: [
    ["Go-to-Market Strategy", 0.95],
    ["Sales Enablement", 0.85],
  ],
};

const DIRECT_SKILL_PATTERNS: Array<{ pattern: RegExp; category: string }> = [
  {
    pattern:
      /\b(python|javascript|typescript|java|golang|go|rust|c\+\+|ruby|php|swift|kotlin)\b/gi,
    category: "language",
  },
  {
    pattern:
      /\b(react|next\.?js|vue|angular|node\.?js|express|django|flask|spring|rails)\b/gi,
    category: "framework",
  },
  {
    pattern:
      /\b(aws|azure|gcp|google cloud|kubernetes|docker|terraform|ansible)\b/gi,
    category: "cloud",
  },
  {
    pattern:
      /\b(postgresql|mysql|mongodb|redis|elasticsearch|snowflake|bigquery|spark|kafka)\b/gi,
    category: "data",
  },
  {
    pattern:
      /\b(tensorflow|pytorch|scikit-learn|pandas|numpy|huggingface|openai|anthropic|langchain)\b/gi,
    category: "ai-ml",
  },
  {
    pattern:
      /\b(git|github|gitlab|jira|confluence|figma|tableau|power bi|salesforce|hubspot)\b/gi,
    category: "tools",
  },
];

function toConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.85) return "HIGH";
  if (score >= 0.7) return "MEDIUM";
  return "SPECULATIVE";
}

function extractSkillsWithContext(
  text: string
): Array<{ skill: string; context: string; category: string }> {
  const results: Array<{ skill: string; context: string; category: string }> =
    [];
  const seen = new Set<string>();

  for (const { pattern, category } of DIRECT_SKILL_PATTERNS) {
    let match;
    pattern.lastIndex = 0;

    while ((match = pattern.exec(text)) !== null) {
      const skill = match[0];
      const skillKey = skill.toLowerCase();

      if (seen.has(skillKey)) continue;
      seen.add(skillKey);

      const start = Math.max(0, match.index - 100);
      const end = Math.min(text.length, match.index + skill.length + 100);
      const context = text.substring(start, end);

      results.push({ skill, context, category });
    }
  }

  return results;
}

function inferImplicitSkills(text: string): InferredSkill[] {
  const inferred: InferredSkill[] = [];
  const textLower = text.toLowerCase();
  const seen = new Set<string>();

  for (const [trigger, skills] of Object.entries(INFERENCE_PATTERNS)) {
    if (textLower.includes(trigger)) {
      const sentences = text.split(/[.!?]+/);
      const sourceSentence =
        sentences.find((s) => s.toLowerCase().includes(trigger)) || "";

      for (const [skillName, confidence] of skills) {
        const skillKey = skillName.toLowerCase();
        if (seen.has(skillKey)) continue;
        seen.add(skillKey);

        inferred.push({
          name: skillName,
          sourceAchievement: sourceSentence.trim().substring(0, 200),
          confidence: toConfidenceLevel(confidence),
          reasoning: `"${trigger}" implies ${skillName} (${(confidence * 100).toFixed(0)}% confidence)`,
        });
      }
    }
  }

  return inferred;
}

function extractJobRequirements(jobText: string): string[] {
  const requirements: string[] = [];
  const lines = jobText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      const cleaned = trimmed.replace(/^[-*\d.)]+\s+/, "").trim();
      if (cleaned.length > 10 && cleaned.length < 200) {
        requirements.push(cleaned);
      }
    }
  }

  for (const { pattern } of DIRECT_SKILL_PATTERNS) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(jobText)) !== null) {
      const skill = match[0];
      if (!requirements.some((r) => r.toLowerCase().includes(skill.toLowerCase()))) {
        requirements.push(skill);
      }
    }
  }

  return Array.from(new Set(requirements));
}

interface SkillMatchResult {
  matched: CompetencyScore[];
  missing: string[];
  leadWith: string[];
  strengthen: string[];
}

function matchSkillsToJob(
  scoredSkills: CompetencyScore[],
  inferredSkills: InferredSkill[],
  jobRequirements: string[]
): SkillMatchResult {
  const matched: CompetencyScore[] = [];
  const missing: string[] = [];
  const leadWith: string[] = [];
  const strengthen: string[] = [];

  const skillMap = new Map<string, CompetencyScore>();
  for (const skill of scoredSkills) {
    skillMap.set(skill.skill.toLowerCase(), skill);
  }

  for (const req of jobRequirements) {
    const reqLower = req.toLowerCase();
    const reqWords = reqLower.split(/\s+/).filter((w) => w.length > 2);

    let found = false;

    const skillEntries = Array.from(skillMap.entries());
    for (const [skillKey, score] of skillEntries) {
      if (
        reqLower.includes(skillKey) ||
        skillKey.includes(reqLower) ||
        reqWords.some((w) => skillKey.includes(w))
      ) {
        matched.push(score);
        found = true;

        if (score.score >= 4) {
          leadWith.push(score.skill);
        } else if (score.score <= 2) {
          strengthen.push(score.skill);
        }
        break;
      }
    }

    if (!found) {
      for (const inferred of inferredSkills) {
        if (reqLower.includes(inferred.name.toLowerCase())) {
          found = true;
          matched.push({
            skill: inferred.name,
            level: "USED",
            score: 2,
            evidence: [inferred.reasoning],
          });
          strengthen.push(inferred.name);
          break;
        }
      }
    }

    if (!found) {
      missing.push(req);
    }
  }

  return { matched, missing, leadWith, strengthen };
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function scoreResume(
  resumeText: string,
  jobDescription: string
): NexusAnalysis {
  // Step 1: Extract explicit skills with context
  const extractedSkills = extractSkillsWithContext(resumeText);

  // Step 2: Score each skill's depth
  const competencyScores: CompetencyScore[] = extractedSkills.map(
    ({ skill, context }) => scoreCompetencyDepth(skill, context)
  );

  // Step 3: Infer implicit skills
  const implicitSkills = inferImplicitSkills(resumeText);

  // Step 4: Extract job requirements
  const jobRequirements = extractJobRequirements(jobDescription);

  // Step 5: Match skills to requirements
  const matchResult = matchSkillsToJob(
    competencyScores,
    implicitSkills,
    jobRequirements
  );

  // Step 6: Calculate consensus score
  const matchedCount = matchResult.matched.length;
  const missingCount = matchResult.missing.length;
  const requirementCount = jobRequirements.length || 1;

  const coverageScore = (matchedCount / requirementCount) * 100;
  const avgDepth =
    matchResult.matched.length > 0
      ? matchResult.matched.reduce((sum, s) => sum + s.score, 0) /
        matchResult.matched.length
      : 1;
  const depthMultiplier = avgDepth / 5;

  const consensusScore = Math.min(
    100,
    Math.round(coverageScore * (0.6 + depthMultiplier * 0.4))
  );

  // Determine confidence
  let confidence: ConfidenceLevel;
  if (consensusScore >= 75 && avgDepth >= 3.5) {
    confidence = "HIGH";
  } else if (consensusScore >= 50 || avgDepth >= 2.5) {
    confidence = "MEDIUM";
  } else {
    confidence = "SPECULATIVE";
  }

  // Build conflicts list
  const conflicts: string[] = [];
  if (missingCount > requirementCount * 0.3) {
    conflicts.push(
      `Missing ${missingCount} of ${requirementCount} key requirements`
    );
  }
  if (avgDepth < 2.5 && matchedCount > 0) {
    conflicts.push("Matched skills show shallow depth - strengthen with evidence");
  }

  // De-emphasize: skills with very low depth
  const deEmphasize = competencyScores
    .filter((s) => s.score === 1)
    .map((s) => s.skill);

  // Interview prep prompts
  const interviewPrep = matchResult.leadWith.slice(0, 5).map((skill) => {
    const score = competencyScores.find(
      (s) => s.skill.toLowerCase() === skill.toLowerCase()
    );
    return `Prepare STAR narrative for ${skill} at ${score?.level || "IMPLEMENTED"} level`;
  });

  return {
    implicitSkills,
    competencyScores,
    consensusScore,
    confidence,
    conflicts,
    leadWith: matchResult.leadWith,
    strengthen: matchResult.strengthen,
    deEmphasize,
    interviewPrep,
    skillCount: competencyScores.length + implicitSkills.length,
    inferredCount: implicitSkills.length,
    matchedCount,
    missingCount,
  };
}

export { scoreCompetencyDepth, inferImplicitSkills, extractSkillsWithContext };
