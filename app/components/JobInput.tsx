"use client";

import { useStore } from "@/lib/store";

export function JobInput() {
  const {
    jobDescription,
    setJobDescription,
    jobTitle,
    setJobTitle,
    company,
    setCompany,
  } = useStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Job Description
        </label>
        <span className="text-xs text-gray-500">
          {jobDescription.length.toLocaleString()} chars
        </span>
      </div>

      {/* Optional fields */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title (optional)"
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here...

Example:
We're looking for a Senior Software Engineer to join our platform team.

Requirements:
- 5+ years of experience with Python or Go
- Experience with AWS, Kubernetes, and Terraform
- Strong system design and architecture skills
- Experience leading technical projects"
        className="flex-1 w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
}
