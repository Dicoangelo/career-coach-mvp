"use client";

import { useStore } from "@/lib/store";
import { JobCard } from "./JobCard";
import type { JobStatus, JobApplication } from "@/lib/types";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: JobStatus;
  title: string;
  jobs: JobApplication[];
  color: string;
}

export function KanbanColumn({ status, title, jobs, color }: KanbanColumnProps) {
  const { updateJobStatus } = useStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData("jobId");
    if (jobId) {
      updateJobStatus(jobId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 min-w-[280px] bg-gray-50 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", color)} />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            Drag jobs here
          </div>
        )}
      </div>
    </div>
  );
}
