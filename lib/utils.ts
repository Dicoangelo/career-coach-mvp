import { clsx, type ClassValue } from "clsx";

/**
 * Utility function for merging classnames
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Get match tier from score
 */
export function getMatchTier(
  score: number
): "STRONG_MATCH" | "MODERATE_MATCH" | "WEAK_MATCH" | "NO_MATCH" {
  if (score >= 75) return "STRONG_MATCH";
  if (score >= 50) return "MODERATE_MATCH";
  if (score >= 25) return "WEAK_MATCH";
  return "NO_MATCH";
}

/**
 * Get tier display info
 */
export function getTierInfo(tier: string): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (tier) {
    case "STRONG_MATCH":
      return {
        label: "Strong Match",
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    case "MODERATE_MATCH":
      return {
        label: "Moderate Match",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
      };
    case "WEAK_MATCH":
      return {
        label: "Weak Match",
        color: "text-orange-700",
        bgColor: "bg-orange-100",
      };
    default:
      return {
        label: "No Match",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
  }
}

/**
 * Get verdict display info
 */
export function getVerdictInfo(verdict: string): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (verdict) {
    case "HIRE":
      return {
        label: "Hire",
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    case "INTERVIEW":
      return {
        label: "Interview",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
      };
    case "NO_HIRE":
      return {
        label: "No Hire",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    default:
      return {
        label: verdict,
        color: "text-gray-700",
        bgColor: "bg-gray-100",
      };
  }
}

/**
 * Format date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
