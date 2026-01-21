/**
 * Multi-Agent Evaluation System
 * Simulates a hiring committee: Hiring Manager, Tech Lead, HR/Culture
 */

import { AIModelGateway, Provider } from "../ai/model-gateway";
import {
  HIRING_MANAGER_PROMPT,
  TECH_LEAD_PROMPT,
  HR_CULTURE_PROMPT,
} from "../ai/prompts";
import type { AgentFeedback, AgentInput, NexusAnalysis } from "../types";

/**
 * Format NSRG analysis as context block for agent prompts
 */
function formatNSRGContext(nexus: NexusAnalysis): string {
  let context = `\n## Pre-Analysis (Nexus Engine)\n`;
  context += `**Match Score:** ${nexus.consensusScore.toFixed(0)}% | **Confidence:** ${nexus.confidence}\n\n`;

  if (nexus.competencyScores.length > 0) {
    context += `**Competency Depth Scores:**\n`;
    nexus.competencyScores.slice(0, 10).forEach((cs) => {
      context += `- ${cs.skill}: ${cs.level} (${cs.score}/5)\n`;
    });
    context += "\n";
  }

  if (nexus.implicitSkills.length > 0) {
    context += `**Inferred Skills (not explicitly stated):**\n`;
    nexus.implicitSkills.slice(0, 8).forEach((is) => {
      context += `- ${is.name} (${is.confidence}): ${is.reasoning}\n`;
    });
    context += "\n";
  }

  if (nexus.leadWith.length > 0) {
    context += `**Strengths to Probe:** ${nexus.leadWith.join(", ")}\n`;
  }

  if (nexus.strengthen.length > 0) {
    context += `**Areas Needing Evidence:** ${nexus.strengthen.join(", ")}\n`;
  }

  if (nexus.conflicts.length > 0) {
    context += `**Flags:** ${nexus.conflicts.join("; ")}\n`;
  }

  return context;
}

async function runAgentEvaluation(
  agentName: "Hiring Manager" | "Tech Lead" | "HR",
  promptTemplate: string,
  input: AgentInput
): Promise<AgentFeedback> {
  // Build NSRG context if available
  const nsrgContext = input.nexusAnalysis
    ? formatNSRGContext(input.nexusAnalysis)
    : "";

  // Inject NSRG context after resume text for grounded evaluation
  const prompt = promptTemplate
    .replace("{{JOB_TITLE}}", input.jobTitle)
    .replace("{{COMPANY}}", input.company)
    .replace("{{JOB_DESCRIPTION}}", input.jobDescription)
    .replace("{{RESUME_TEXT}}", input.resumeText + nsrgContext);

  // Dynamic Model Selection logic
  let provider: Provider = "anthropic";
  let apiKey = process.env.ANTHROPIC_API_KEY!;

  if (agentName === "Tech Lead") {
    if (process.env.XAI_API_KEY) {
      provider = "xai";
      apiKey = process.env.XAI_API_KEY;
    } else if (process.env.GEMINI_API_KEY) {
      provider = "google";
      apiKey = process.env.GEMINI_API_KEY;
    }
  } else if (agentName === "HR") {
    if (process.env.OPENAI_API_KEY) {
      provider = "openai";
      apiKey = process.env.OPENAI_API_KEY;
    }
  }

  try {
    const client = new AIModelGateway({ apiKey, provider });

    const response = await client.chat([{ role: "user", content: prompt }]);
    const rawResponse = response.content;

    // Extract JSON from potential markdown code blocks
    let json: Record<string, unknown> = {};
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        json = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.warn(`[Multi-Agent] JSON parse failed for ${agentName}`);
    }

    return {
      agentName,
      verdict: (json.recommendation as AgentFeedback["verdict"]) || "INTERVIEW",
      concerns: (json.concerns as string[]) || [],
      praises: (json.strengths as string[]) || [],
    };
  } catch (error) {
    console.error(`Agent ${agentName} (${provider}) evaluation failed:`, error);
    return {
      agentName,
      verdict: "INTERVIEW",
      concerns: ["Evaluation failed - please retry"],
      praises: [],
    };
  }
}

/**
 * Run the full multi-agent hiring committee evaluation
 */
export async function runMultiAgentEvaluation(
  input: AgentInput
): Promise<AgentFeedback[]> {
  console.log(
    `[Multi-Agent] Starting committee evaluation for ${input.jobTitle} at ${input.company}...`
  );

  // Run all three agents in parallel
  const [hmResult, tlResult, hrResult] = await Promise.all([
    runAgentEvaluation("Hiring Manager", HIRING_MANAGER_PROMPT, input),
    runAgentEvaluation("Tech Lead", TECH_LEAD_PROMPT, input),
    runAgentEvaluation("HR", HR_CULTURE_PROMPT, input),
  ]);

  console.log(`[Multi-Agent] Committee evaluation complete.`);

  return [hmResult, tlResult, hrResult];
}
