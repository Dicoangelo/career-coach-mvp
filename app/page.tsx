"use client";

import { Header } from "./components/Header";
import { AnalyzeTab } from "./components/AnalyzeTab";
import { TrackTab } from "./components/TrackTab";
import { StatsTab } from "./components/StatsTab";
import { useStore } from "@/lib/store";

export default function Home() {
  const { activeTab } = useStore();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "analyze" && <AnalyzeTab />}
        {activeTab === "track" && <TrackTab />}
        {activeTab === "stats" && <StatsTab />}
      </main>
    </div>
  );
}
