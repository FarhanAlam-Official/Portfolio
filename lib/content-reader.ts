/**
 * content-reader.ts
 * -----------------
 * The NEW single source of truth for all public-facing portfolio data.
 * Reads from data/content.json which is managed by the dashboard CMS.
 *
 * Flow:
 *   Dashboard edit → /api/content/update → data/content.json → GitHub sync → rebuild
 *
 * NOTE: lib/data.ts and lib/projects-data.ts are kept as legacy seed files only.
 * They are no longer used by the public site. Do NOT edit them for content changes.
 * They will be removed after this setup is verified stable.
 */

import contentJson from '../data/content.json';
import type { PortfolioContent } from '@/lib/schemas/content-schema';

// Cast the imported JSON to the typed schema
const content = contentJson as unknown as PortfolioContent;

// Re-export individual sections to match existing import patterns in components.
// Components can swap `from "@/lib/data"` → `from "@/lib/content-reader"` with zero other changes.

export const personalInfo = content.personalInfo;
export const experience = content.experience;
export const education = content.education;
export const skills = content.skills;
export const testimonials = content.testimonials;
export const certifications = content.certifications;
export const awards = content.awards;
export const projects = content.projects;
export const blog = content.blog;
export const stats = content.stats;
export const theme = content.theme;

// Export the full content object for consumers that need everything
export default content;

// Export Project type to match lib/projects-data.ts interface
export type Project = PortfolioContent['projects'][0];

// content-reader: SSoT utility
