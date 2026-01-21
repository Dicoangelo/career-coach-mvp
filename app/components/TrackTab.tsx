"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { KanbanColumn } from "./KanbanColumn";
import { Plus, X } from "lucide-react";
import type { JobStatus } from "@/lib/types";

const columns: Array<{
  status: JobStatus;
  title: string;
  color: string;
}> = [
  { status: "saved", title: "Saved", color: "bg-gray-400" },
  { status: "applied", title: "Applied", color: "bg-blue-500" },
  { status: "interview", title: "Interview", color: "bg-yellow-500" },
  { status: "offer", title: "Offer", color: "bg-green-500" },
];

export function TrackTab() {
  const { jobs, addJob, getJobsByStatus } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    url: "",
    notes: "",
  });

  const handleAddJob = () => {
    if (!newJob.title.trim() || !newJob.company.trim()) return;

    addJob({
      title: newJob.title.trim(),
      company: newJob.company.trim(),
      url: newJob.url.trim() || undefined,
      notes: newJob.notes.trim() || undefined,
      status: "saved",
    });

    setNewJob({ title: "", company: "", url: "", notes: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Job Tracker</h2>
          <p className="text-sm text-gray-500">
            {jobs.length} jobs tracked
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {/* Add Job Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Job</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                  placeholder="Senior Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={newJob.company}
                  onChange={(e) =>
                    setNewJob({ ...newJob, company: e.target.value })
                  }
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job URL
                </label>
                <input
                  type="url"
                  value={newJob.url}
                  onChange={(e) =>
                    setNewJob({ ...newJob, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newJob.notes}
                  onChange={(e) =>
                    setNewJob({ ...newJob, notes: e.target.value })
                  }
                  placeholder="Any notes about this job..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddJob}
                  disabled={!newJob.title.trim() || !newJob.company.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            color={col.color}
            jobs={getJobsByStatus(col.status)}
          />
        ))}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-4">No jobs tracked yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first job
          </button>
        </div>
      )}
    </div>
  );
}
