import prisma from "@/lib/prisma";
import { toExperienceView, type ExperienceView } from "@/types";
import { orderExperiences } from "./config";

/**
 * Fetch career-history entries for the public Experience timeline
 * (Requirement 5.1).
 *
 * Queries the shared Prisma client for every experience entry ordered
 * chronologically — most-recent-first by `startDate` descending, with the
 * explicit `order` field as a deterministic tie-breaker — and maps each row to
 * the serializable {@link ExperienceView} DTO so the section stays free of
 * `Date`/nullable Prisma types (Requirement 17.2). The result is passed through
 * {@link orderExperiences} as a defensive re-sort, so the chronological
 * ordering invariant holds regardless of how the data arrives.
 */
export async function getExperiences(): Promise<ExperienceView[]> {
  const rows = await prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { order: "asc" }],
  });

  return orderExperiences(rows.map(toExperienceView));
}
