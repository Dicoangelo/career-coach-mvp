import { NextResponse } from "next/server";
import { scoreResume } from "@/lib/engines/nexus";
import { runMultiAgentEvaluation } from "@/lib/engines/multi-agent-eval";
import { generateChameleonMetrics } from "@/lib/engines/chameleon";
import { getMatchTier } from "@/lib/utils";
import type { AnalyzeRequest, AnalyzeResponse, AnalysisResult } from "@/lib/types";

export async function POST(request: Request): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const body: AnalyzeRequest = await request.json();

    const { resumeText, jobDescription, jobTitle, company, archetype } = body;

    // Validate input
    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { success: false, error: "Resume text is too short (min 50 characters)" },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json(
        { success: false, error: "Job description is too short (min 50 characters)" },
        { status: 400 }
      );
    }

    // Step 1: Run Nexus Engine for skill analysis
    console.log("[Analyze] Running Nexus Engine...");
    const nexusAnalysis = scoreResume(resumeText, jobDescription);

    // Step 2: Run Multi-Agent Evaluation (with Nexus grounding)
    console.log("[Analyze] Running Multi-Agent Evaluation...");
    const committeeFeedback = await runMultiAgentEvaluation({
      resumeText,
      jobDescription,
      jobTitle: jobTitle || "Position",
      company: company || "Company",
      nexusAnalysis,
    });

    // Step 3: Generate Chameleon metrics if archetype selected
    let chameleonMetrics;
    if (archetype) {
      console.log(`[Analyze] Generating Chameleon metrics for ${archetype}...`);
      chameleonMetrics = generateChameleonMetrics(resumeText, archetype);
    }

    // Calculate final match score (weighted average of Nexus + Committee)
    const agentAvgScore =
      committeeFeedback.reduce((sum, fb) => {
        // Map verdicts to scores
        const verdictScore =
          fb.verdict === "HIRE" ? 90 : fb.verdict === "INTERVIEW" ? 60 : 30;
        return sum + verdictScore;
      }, 0) / committeeFeedback.length;

    // Weighted: 60% Nexus + 40% Committee
    const matchScore = Math.round(
      nexusAnalysis.consensusScore * 0.6 + agentAvgScore * 0.4
    );

    const result: AnalysisResult = {
      matchScore,
      matchTier: getMatchTier(matchScore),
      committeeFeedback,
      nexusAnalysis,
      chameleonMetrics,
      selectedArchetype: archetype,
      jobTitle: jobTitle || "Position",
      company: company || "Company",
      analyzedAt: new Date().toISOString(),
    };

    console.log("[Analyze] Analysis complete. Score:", matchScore);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("[Analyze] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}
