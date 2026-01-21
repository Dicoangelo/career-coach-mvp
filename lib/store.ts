/**
 * Zustand Store for Career Coach MVP
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Archetype,
  AnalysisResult,
  JobApplication,
  JobStatus,
} from "./types";

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface AppState {
  // Tab navigation
  activeTab: "analyze" | "track" | "stats";
  setActiveTab: (tab: "analyze" | "track" | "stats") => void;

  // Analysis state
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  company: string;
  setCompany: (company: string) => void;
  selectedArchetype: Archetype | null;
  setSelectedArchetype: (archetype: Archetype | null) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  analysisError: string | null;
  setAnalysisError: (error: string | null) => void;

  // Jobs state
  jobs: JobApplication[];
  addJob: (job: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;

  // Computed helpers
  getJobsByStatus: (status: JobStatus) => JobApplication[];
  getStats: () => {
    total: number;
    saved: number;
    applied: number;
    interview: number;
    offer: number;
    responseRate: number;
    interviewRate: number;
  };

  // Reset
  clearAnalysis: () => void;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Tab navigation
      activeTab: "analyze",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Analysis state
      resumeText: "",
      setResumeText: (text) => set({ resumeText: text }),
      jobDescription: "",
      setJobDescription: (text) => set({ jobDescription: text }),
      jobTitle: "",
      setJobTitle: (title) => set({ jobTitle: title }),
      company: "",
      setCompany: (company) => set({ company }),
      selectedArchetype: null,
      setSelectedArchetype: (archetype) => set({ selectedArchetype: archetype }),
      analysisResult: null,
      setAnalysisResult: (result) => set({ analysisResult: result }),
      isAnalyzing: false,
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      analysisError: null,
      setAnalysisError: (error) => set({ analysisError: error }),

      // Jobs state
      jobs: [],
      addJob: (job) =>
        set((state) => ({
          jobs: [
            ...state.jobs,
            {
              ...job,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateJobStatus: (id, status) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id
              ? {
                  ...job,
                  status,
                  appliedAt:
                    status === "applied" && !job.appliedAt
                      ? new Date().toISOString()
                      : job.appliedAt,
                  updatedAt: new Date().toISOString(),
                }
              : job
          ),
        })),
      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id
              ? { ...job, ...updates, updatedAt: new Date().toISOString() }
              : job
          ),
        })),
      deleteJob: (id) =>
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        })),

      // Computed helpers
      getJobsByStatus: (status) => get().jobs.filter((j) => j.status === status),
      getStats: () => {
        const jobs = get().jobs;
        const total = jobs.length;
        const saved = jobs.filter((j) => j.status === "saved").length;
        const applied = jobs.filter((j) => j.status === "applied").length;
        const interview = jobs.filter((j) => j.status === "interview").length;
        const offer = jobs.filter((j) => j.status === "offer").length;

        const activeApps = applied + interview + offer;
        const responseRate =
          activeApps > 0 ? ((interview + offer) / activeApps) * 100 : 0;
        const interviewRate =
          interview + offer > 0 ? (offer / (interview + offer)) * 100 : 0;

        return {
          total,
          saved,
          applied,
          interview,
          offer,
          responseRate,
          interviewRate,
        };
      },

      // Reset
      clearAnalysis: () =>
        set({
          analysisResult: null,
          analysisError: null,
        }),
    }),
    {
      name: "career-coach-storage",
      partialize: (state) => ({
        jobs: state.jobs,
        resumeText: state.resumeText,
      }),
    }
  )
);
