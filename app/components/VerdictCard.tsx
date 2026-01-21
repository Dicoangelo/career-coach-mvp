"use client";

import { User, Code, Heart, CheckCircle, AlertCircle } from "lucide-react";
import type { AgentFeedback } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getVerdictInfo } from "@/lib/utils";

const agentIcons: Record<AgentFeedback["agentName"], React.ComponentType<{ className?: string }>> = {
  "Hiring Manager": User,
  "Tech Lead": Code,
  HR: Heart,
};

const agentColors: Record<AgentFeedback["agentName"], string> = {
  "Hiring Manager": "bg-purple-100 text-purple-700",
  "Tech Lead": "bg-cyan-100 text-cyan-700",
  HR: "bg-pink-100 text-pink-700",
};

interface VerdictCardProps {
  feedback: AgentFeedback;
}

export function VerdictCard({ feedback }: VerdictCardProps) {
  const Icon = agentIcons[feedback.agentName];
  const verdictInfo = getVerdictInfo(feedback.verdict);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              agentColors[feedback.agentName]
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-medium text-gray-900">{feedback.agentName}</span>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            verdictInfo.bgColor,
            verdictInfo.color
          )}
        >
          {verdictInfo.label}
        </span>
      </div>

      {/* Strengths */}
      {feedback.praises.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle className="w-3 h-3" />
            Strengths
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {feedback.praises.slice(0, 3).map((praise, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-green-500 mt-1">+</span>
                <span>{praise}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {feedback.concerns.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-red-700">
            <AlertCircle className="w-3 h-3" />
            Concerns
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {feedback.concerns.slice(0, 3).map((concern, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-red-500 mt-1">-</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
