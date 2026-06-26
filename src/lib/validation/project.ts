import { z } from "zod";

import {
  nonEmptyStringArray,
  optionalUrl,
  orderSchema,
  requiredText,
  slugSchema,
} from "./shared";

/**
 * Project validation (Requirement 10.4; Property 4). Mirrors the Prisma
 * `Project` model's create/update fields with bounds and URL validation so the
 * admin CMS can never persist a malformed project.
 */
export const projectSchema = z.object({
  title: requiredText("Title").max(120, "Title must be 120 characters or fewer"),
  slug: slugSchema,
  summary: requiredText("Summary"),
  problem: requiredText("Problem"),
  solution: requiredText("Solution"),
  impact: requiredText("Impact"),
  technologies: nonEmptyStringArray.min(1, "Add at least one technology"),
  thumbnailUrl: optionalUrl,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(false),
  order: orderSchema,
});

export type ProjectInput = z.infer<typeof projectSchema>;
