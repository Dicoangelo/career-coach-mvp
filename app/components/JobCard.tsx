"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { JobApplication } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";
import { MoreVertical, Trash2, ExternalLink } from "lucide-react";

interface JobCardProps {
  job: JobApplication;
}

export function JobCard({ job }: JobCardProps) {
  const { deleteJob } = useStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("jobId", job.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{job.title}</h4>
          <p className="text-sm text-gray-500 truncate">{job.company}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </a>
              )}
              <button
                onClick={() => {
                  deleteJob(job.id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {job.notes && (
        <p className="text-xs text-gray-500 mt-2">{truncate(job.notes, 80)}</p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {formatDate(job.createdAt)}
        </span>
        {job.analysisResult && (
          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
            {job.analysisResult.matchScore}% match
          </span>
        )}
      </div>
    </div>
  );
}
