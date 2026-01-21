/**
 * Chameleon Engine - Archetype-based resume rewrites
 */

import type { Archetype, ArchetypeConfig, ChameleonMetrics } from "../types";

// ============================================================================
// ARCHETYPE CONFIGURATIONS
// ============================================================================

export const ARCHETYPE_CONFIGS: Record<Archetype, ArchetypeConfig> = {
  speed: {
    keyword: "speed",
    label: "Velocity Culture",
    tooltip:
      "For fast-moving startups that ship quickly and hate bureaucracy",
    focus:
      "Removing friction, automation, velocity, immediate impact, anti-bureaucracy.",
    rewriteRule:
      "Convert 'managed' to 'accelerated'. Convert 'process' to 'system'. Focus on time-saved and velocity metrics.",
  },
  safety: {
    keyword: "safety",
    label: "Reliability Culture",
    tooltip:
      "For companies that value governance, compliance, and stability",
    focus:
      "Reliability, governance, audit trails, risk mitigation, stable scaling.",
    rewriteRule:
      "Convert 'fast' to 'reliable'. Convert 'built' to 'secured'. Focus on accuracy, up-time, and compliance metrics.",
  },
  creative: {
    keyword: "creative",
    label: "Innovation Culture",
    tooltip: "For zero-to-one builders focused on novel solutions",
    focus:
      "Innovation, zero-to-one, prototyping, bridging research to product, novelty.",
    rewriteRule:
      "Convert 'optimized' to 'invented'. Focus on 'first-of-kind', 'prototypes', and 'novel architectures'.",
  },
  ecosystem: {
    keyword: "ecosystem",
    label: "Scale Culture",
    tooltip: "For platform companies leveraging network effects",
    focus:
      "Network effects, partnerships, integrations, platform leverage, community.",
    rewriteRule:
      "Convert individual metrics to network metrics. Focus on 'attachment rates', 'partner influence', and 'joint value'.",
  },
};

// ============================================================================
// SAMPLE REWRITES (Fallback for demo)
// ============================================================================

export const SAMPLE_REWRITES: Record<
  string,
  Record<Archetype | "original", string>
> = {
  revenue: {
    original: "Managed $800M in registered deal value.",
    speed:
      "Removed friction from an $800M revenue pipe, accelerating deal velocity.",
    safety:
      "Ensured governance and auditability for $800M in sensitive transaction volume.",
    ecosystem:
      "Architected the partner ecosystem handling $800M in cross-cloud flow.",
    creative: "Designed the deal-flow architecture that processed $800M in value.",
  },
  automation: {
    original: "Reduced deal registration time by 50% through CRM automation.",
    speed:
      "Slashed 50% of manual drag from deal reg using aggressive automation.",
    safety:
      "Automated deal reg to eliminate human error, reducing risk and time by 50%.",
    ecosystem:
      "Streamlined partner access, boosting ecosystem throughput by 50%.",
    creative:
      "Invented a novel CRM automation workflow that cut registration time in half.",
  },
  pipeline: {
    original: "Built and managed a $150M partner-sourced pipeline.",
    speed:
      "Accelerated partner pipeline to $150M with zero bureaucratic overhead.",
    safety:
      "Established a compliant $150M partner pipeline with full audit trails.",
    ecosystem:
      "Scaled partner network to generate $150M in joint pipeline value.",
    creative:
      "Pioneered a new partner sourcing model generating $150M in pipeline.",
  },
  team: {
    original: "Led a cross-functional team of 12 engineers.",
    speed:
      "Directed a lean 12-person strike team shipping features at 2x industry speed.",
    safety:
      "Managed a 12-person team with clear accountability and zero incidents.",
    ecosystem:
      "Orchestrated 12 engineers across multiple partner integration squads.",
    creative:
      "Assembled a 12-person innovation pod shipping first-of-kind features.",
  },
};

// ============================================================================
// REWRITE FUNCTIONS
// ============================================================================

/**
 * Get archetype config for display
 */
export function getArchetypeConfig(archetype: Archetype): ArchetypeConfig {
  return ARCHETYPE_CONFIGS[archetype];
}

/**
 * Get all archetype configs
 */
export function getAllArchetypes(): Array<{
  id: Archetype;
  config: ArchetypeConfig;
}> {
  return (Object.keys(ARCHETYPE_CONFIGS) as Archetype[]).map((id) => ({
    id,
    config: ARCHETYPE_CONFIGS[id],
  }));
}

/**
 * Generate sample rewrites for a given archetype (local/fast)
 */
export function getSampleRewrites(archetype: Archetype): ChameleonMetrics[] {
  return Object.entries(SAMPLE_REWRITES).map(([id, variants]) => ({
    id,
    original: variants.original,
    rewritten: variants[archetype],
    archetype,
  }));
}

/**
 * Extract bullet points from resume text
 */
export function extractBulletPoints(resumeText: string): string[] {
  const bullets: string[] = [];
  const lines = resumeText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Match common bullet formats
    if (/^[-*]\s+/.test(trimmed)) {
      const content = trimmed.replace(/^[-*]\s+/, "").trim();
      if (content.length > 20 && content.length < 300) {
        bullets.push(content);
      }
    }
    // Match lines that look like achievements (start with action verb, have numbers)
    else if (/^[A-Z][a-z]+ed?\s/.test(trimmed) && /\d/.test(trimmed)) {
      if (trimmed.length > 20 && trimmed.length < 300) {
        bullets.push(trimmed);
      }
    }
  }

  return bullets.slice(0, 10); // Max 10 bullets
}

/**
 * Apply archetype transformation to a bullet point (rule-based, no API)
 */
export function transformBullet(
  bullet: string,
  archetype: Archetype
): string {
  let transformed = bullet;

  switch (archetype) {
    case "speed":
      transformed = transformed
        .replace(/\bmanaged\b/gi, "accelerated")
        .replace(/\bprocess\b/gi, "system")
        .replace(/\bcreated\b/gi, "shipped")
        .replace(/\bdeveloped\b/gi, "rapidly deployed")
        .replace(/\bimplemented\b/gi, "fast-tracked");
      break;

    case "safety":
      transformed = transformed
        .replace(/\bfast\b/gi, "reliable")
        .replace(/\bbuilt\b/gi, "secured")
        .replace(/\bshipped\b/gi, "deployed with oversight")
        .replace(/\bquickly\b/gi, "with full compliance")
        .replace(/\bautomated\b/gi, "governed automation of");
      break;

    case "creative":
      transformed = transformed
        .replace(/\boptimized\b/gi, "invented")
        .replace(/\bimproved\b/gi, "reimagined")
        .replace(/\bbuilt\b/gi, "pioneered")
        .replace(/\bimplemented\b/gi, "prototyped")
        .replace(/\bdeveloped\b/gi, "designed first-of-kind");
      break;

    case "ecosystem":
      transformed = transformed
        .replace(/\bmanaged\b/gi, "orchestrated across partners")
        .replace(/\bled\b/gi, "coordinated ecosystem-wide")
        .replace(/\bbuilt\b/gi, "scaled through partnerships")
        .replace(/\bgenerated\b/gi, "enabled network-driven")
        .replace(/\bindividual\b/gi, "collective");
      break;
  }

  return transformed;
}

/**
 * Generate chameleon metrics for resume bullets
 */
export function generateChameleonMetrics(
  resumeText: string,
  archetype: Archetype
): ChameleonMetrics[] {
  const bullets = extractBulletPoints(resumeText);

  if (bullets.length === 0) {
    // Return sample rewrites if no bullets found
    return getSampleRewrites(archetype);
  }

  return bullets.map((bullet, index) => ({
    id: `bullet-${index}`,
    original: bullet,
    rewritten: transformBullet(bullet, archetype),
    archetype,
  }));
}
