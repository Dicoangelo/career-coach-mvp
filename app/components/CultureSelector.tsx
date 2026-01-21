"use client";

import { useStore } from "@/lib/store";
import { getAllArchetypes } from "@/lib/engines/chameleon";
import { cn } from "@/lib/utils";
import { Zap, Shield, Lightbulb, Network } from "lucide-react";
import type { Archetype } from "@/lib/types";

const icons: Record<Archetype, React.ComponentType<{ className?: string }>> = {
  speed: Zap,
  safety: Shield,
  creative: Lightbulb,
  ecosystem: Network,
};

export function CultureSelector() {
  const { selectedArchetype, setSelectedArchetype } = useStore();
  const archetypes = getAllArchetypes();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Target Culture (Optional)
      </label>
      <p className="text-xs text-gray-500">
        Select a culture to get rewritten resume bullets tailored to that environment
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {archetypes.map(({ id, config }) => {
          const Icon = icons[id];
          const isSelected = selectedArchetype === id;
          return (
            <button
              key={id}
              onClick={() =>
                setSelectedArchetype(isSelected ? null : id)
              }
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center",
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
              title={config.tooltip}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{config.label}</span>
              <span className="text-xs text-gray-500 line-clamp-2">
                {config.tooltip}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
