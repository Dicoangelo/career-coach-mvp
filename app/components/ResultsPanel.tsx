"use client";

import { useStore } from "@/lib/store";
import { VerdictCard } from "./VerdictCard";
import { getTierInfo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Target, Brain, Sparkles, ArrowRight } from "lucide-react";

export function ResultsPanel() {
  const { analysisResult, selectedArchetype } = useStore();

  if (!analysisResult) return null;

  const tierInfo = getTierInfo(analysisResult.matchTier);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Match Score Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Match Score
              </h3>
              <p className="text-sm text-gray-500">
                {analysisResult.jobTitle || "Position"}{" "}
                {analysisResult.company && `at ${analysisResult.company}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">
              {analysisResult.matchScore}%
            </div>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                tierInfo.bgColor,
                tierInfo.color
              )}
            >
              {tierInfo.label}
            </span>
          </div>
        </div>

        {/* Nexus Analysis Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {analysisResult.nexusAnalysis.skillCount}
            </div>
            <div className="text-xs text-gray-500">Skills Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {analysisResult.nexusAnalysis.matchedCount}
            </div>
            <div className="text-xs text-gray-500">Requirements Met</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {analysisResult.nexusAnalysis.inferredCount}
            </div>
            <div className="text-xs text-gray-500">Skills Inferred</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {analysisResult.nexusAnalysis.missingCount}
            </div>
            <div className="text-xs text-gray-500">Gaps Identified</div>
          </div>
        </div>
      </div>

      {/* Hiring Panel Verdicts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Hiring Panel Verdict
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysisResult.committeeFeedback.map((feedback) => (
            <VerdictCard key={feedback.agentName} feedback={feedback} />
          ))}
        </div>
      </div>

      {/* Lead With & Strengthen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysisResult.nexusAnalysis.leadWith.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Lead With</h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.nexusAnalysis.leadWith.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {analysisResult.nexusAnalysis.strengthen.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              Needs Evidence
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.nexusAnalysis.strengthen.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chameleon Rewrites */}
      {analysisResult.chameleonMetrics &&
        analysisResult.chameleonMetrics.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Rewritten for{" "}
                {selectedArchetype?.charAt(0).toUpperCase()}
                {selectedArchetype?.slice(1)} Culture
              </h3>
            </div>
            <div className="space-y-4">
              {analysisResult.chameleonMetrics.slice(0, 5).map((metric) => (
                <div
                  key={metric.id}
                  className="border-l-2 border-purple-300 pl-4 space-y-2"
                >
                  <div className="text-sm text-gray-500 line-through">
                    {metric.original}
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-800 font-medium">
                      {metric.rewritten}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Interview Prep */}
      {analysisResult.nexusAnalysis.interviewPrep.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Interview Prep</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            {analysisResult.nexusAnalysis.interviewPrep.map((prep, i) => (
              <li key={i}>• {prep}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
