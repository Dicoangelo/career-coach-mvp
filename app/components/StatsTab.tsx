"use client";

import { useStore } from "@/lib/store";
import { Briefcase, Send, MessageSquare, Trophy, TrendingUp } from "lucide-react";

export function StatsTab() {
  const { getStats, jobs } = useStore();
  const stats = getStats();

  const cards = [
    {
      label: "Total Jobs",
      value: stats.total,
      icon: Briefcase,
      color: "bg-gray-100 text-gray-700",
    },
    {
      label: "Saved",
      value: stats.saved,
      icon: Briefcase,
      color: "bg-gray-100 text-gray-600",
    },
    {
      label: "Applied",
      value: stats.applied,
      icon: Send,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Interviews",
      value: stats.interview,
      icon: MessageSquare,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Offers",
      value: stats.offer,
      icon: Trophy,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
        <p className="text-sm text-gray-500">
          Track your job search progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Conversion Funnel
          </h3>
        </div>

        {stats.total > 0 ? (
          <div className="space-y-4">
            {/* Applied */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Saved → Applied</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.applied + stats.interview + stats.offer} / {stats.total}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${((stats.applied + stats.interview + stats.offer) / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Response Rate */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.responseRate.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: `${stats.responseRate}%` }}
                />
              </div>
            </div>

            {/* Interview to Offer */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  Interview → Offer
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.interviewRate.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${stats.interviewRate}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Add jobs to see your conversion funnel
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {jobs
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .slice(0, 5)
              .map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.company}</div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      job.status === "offer"
                        ? "bg-green-100 text-green-700"
                        : job.status === "interview"
                          ? "bg-yellow-100 text-yellow-700"
                          : job.status === "applied"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
