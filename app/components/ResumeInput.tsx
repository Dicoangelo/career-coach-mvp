"use client";

import { useStore } from "@/lib/store";
import { FileText } from "lucide-react";

export function ResumeInput() {
  const { resumeText, setResumeText } = useStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, only handle text files
    if (file.type === "text/plain") {
      const text = await file.text();
      setResumeText(text);
    } else {
      // For other files, show a message
      alert("Please paste your resume text directly. PDF parsing coming soon.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Resume</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {resumeText.length.toLocaleString()} chars
          </span>
          <label className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Upload
            <input
              type="file"
              accept=".txt,.md"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume here...

Example:
- Led a cross-functional team of 12 engineers to deliver a $10M platform migration
- Architected a microservices infrastructure serving 1M+ daily users
- Built CI/CD pipelines reducing deployment time by 70%"
        className="flex-1 w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
}
