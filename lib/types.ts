/**
 * Career Coach MVP - Type Definitions
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'SPECULATIVE';
export type CompetencyLevel = 'EXPOSED' | 'USED' | 'IMPLEMENTED' | 'LED' | 'ARCHITECTED';
export type Archetype = 'speed' | 'safety' | 'ecosystem' | 'creative';
export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer';

// ============================================================================
// NEXUS ENGINE TYPES
// ============================================================================

export interface InferredSkill {
  name: string;
  sourceAchievement: string;
  confidence: ConfidenceLevel;
  reasoning: string;
}

export interface CompetencyScore {
  skill: string;
  level: CompetencyLevel;
  evidence: string[];
  score: number; // 1-5
}

export interface NexusAnalysis {
  // Core NSRG
  implicitSkills: InferredSkill[];
  competencyScores: CompetencyScore[];

  // V2 Consensus
  consensusScore: number; // 0-100
  confidence: ConfidenceLevel;
  conflicts: string[];
  leadWith: string[];
  strengthen: string[];
  deEmphasize: string[];
  interviewPrep: string[];

  // Metadata
  skillCount: number;
  inferredCount: number;
  matchedCount: number;
  missingCount: number;
}

// ============================================================================
// MULTI-AGENT TYPES
// ============================================================================

export interface AgentFeedback {
  agentName: 'Hiring Manager' | 'Tech Lead' | 'HR';
  verdict: 'HIRE' | 'NO_HIRE' | 'INTERVIEW';
  concerns: string[];
  praises: string[];
}

export interface AgentInput {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
  company: string;
  nexusAnalysis?: NexusAnalysis;
}

// ============================================================================
// CHAMELEON ENGINE TYPES
// ============================================================================

export interface ArchetypeConfig {
  keyword: string;
  label: string;
  tooltip: string;
  focus: string;
  rewriteRule: string;
}

export interface ChameleonMetrics {
  id: string;
  original: string;
  rewritten: string;
  archetype: Archetype;
}

// ============================================================================
// ANALYSIS RESULT TYPES
// ============================================================================

export type MatchTier = 'STRONG_MATCH' | 'MODERATE_MATCH' | 'WEAK_MATCH' | 'NO_MATCH';

export interface AnalysisResult {
  // Scores
  matchScore: number; // 0-100
  matchTier: MatchTier;

  // Multi-agent feedback
  committeeFeedback: AgentFeedback[];

  // Nexus analysis
  nexusAnalysis: NexusAnalysis;

  // Chameleon rewrites (if archetype selected)
  chameleonMetrics?: ChameleonMetrics[];
  selectedArchetype?: Archetype;

  // Metadata
  jobTitle: string;
  company: string;
  analyzedAt: string;
}

// ============================================================================
// JOB TRACKING TYPES
// ============================================================================

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  appliedAt?: string;
  url?: string;
  notes?: string;
  analysisResult?: AnalysisResult;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  company?: string;
  archetype?: Archetype;
}

export interface AnalyzeResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
}

export interface JobsResponse {
  success: boolean;
  jobs?: JobApplication[];
  error?: string;
}
