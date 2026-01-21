"use client";

import { useStore } from "@/lib/store";
import { ResumeInput } from "./ResumeInput";
import { JobInput } from "./JobInput";
import { CultureSelector } from "./CultureSelector";
import { ResultsPanel } from "./ResultsPanel";
import { Loader2, Sparkles } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

export function AnalyzeTab() {
  const {
    resumeText,
    jobDescription,
    jobTitle,
    company,
    selectedArchetype,
    isAnalyzing,
    setIsAnalyzing,
    analysisResult,
    setAnalysisResult,
    analysisError,
    setAnalysisError,
  } = useStore();

  const canAnalyze = resumeText.trim().length > 50 && jobDescription.trim().length > 50;

  const handleAnalyze = async () => {
    if (!canAnalyze || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle: jobTitle || "Position",
          company: company || "Company",
          archetype: selectedArchetype,
        }),
      });

      const data: AnalyzeResponse = await response.json();

      if (data.success && data.result) {
        setAnalysisResult(data.result);
      } else {
        setAnalysisError(data.error || "Analysis failed");
      }
    } catch (error) {
      setAnalysisError("Failed to connect to analysis service");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[400px] flex flex-col">
          <ResumeInput />
        </div>

        {/* Job Description Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[400px] flex flex-col">
          <JobInput />
        </div>
      </div>

      {/* Culture Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <CultureSelector />
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get Hiring Panel Verdict
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {analysisError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
          {analysisError}
        </div>
      )}

      {/* Results */}
      {analysisResult && <ResultsPanel />}
    </div>
  );
}
