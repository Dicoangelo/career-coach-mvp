"use client";

import { FileText, Briefcase, BarChart3, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: "file" | "briefcase" | "chart" | "target";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const icons = {
  file: FileText,
  briefcase: Briefcase,
  chart: BarChart3,
  target: Target,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function AnalyzeEmptyState() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100 p-8 text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Get Your Hiring Panel Verdict
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Paste your resume and a job description to receive feedback from a
        simulated hiring committee of 3 AI agents.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-purple-600 text-xs font-bold">1</span>
          </div>
          <p className="text-sm text-gray-600">Paste your resume</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-purple-600 text-xs font-bold">2</span>
          </div>
          <p className="text-sm text-gray-600">Add job description</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-purple-600 text-xs font-bold">3</span>
          </div>
          <p className="text-sm text-gray-600">Get AI verdicts</p>
        </div>
      </div>
    </div>
  );
}
