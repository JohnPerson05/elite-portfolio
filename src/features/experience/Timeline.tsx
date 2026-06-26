import { FadeUp, Stagger } from "@/components/motion";
import { Card, EmptyState, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ExperienceView } from "@/types";
import {
  EXPERIENCE_EYEBROW,
  EXPERIENCE_HEADING,
  formatDateRange,
  orderExperiences,
} from "./config";
import { getExperiences } from "./data";

export interface TimelineProps {
  /**
   * Override the experience entries rendered. Defaults to a live query of all
   * entries. Primarily an injection seam for tests; production renders the live
   * data fetched from the shared Prisma client. The injected list is still run
   * through {@link orderExperiences} so the chronological ordering invariant
   * (Requirement 5.1) holds either way.
   */
  experiences?: readonly ExperienceView[];
  /** Eyebrow label above the heading. */
  eyebrow?: string;
  /** Section heading text. */
  heading?: string;
  className?: string;
}

/**
 * `Timeline` — the homepage experience section (Requirement 5).
 *
 * A React Server Component: it fetches career-history entries via the shared
 * Prisma client ({@link getExperiences}), ordered chronologically
 * most-recent-first, and renders each as a timeline entry showing company,
 * position, tenure, impact, and key achievements (Requirement 5.1). Callers may
 * inject an `experiences` array (used by tests); the injected list is still run
 * through {@link orderExperiences} so the ordering invariant holds either way.
 *
 * Motion (Requirement 5.2): a {@link Stagger} container orchestrates staggered
 * scroll-triggered reveals of each entry (wrapped in {@link FadeUp}), guiding
 * attention sequentially down the timeline and honoring reduced motion via the
 * shared primitives.
 *
 * Layout (Requirement 5.3 / Correctness Property 12): a single-column ordered
 * list at every breakpoint, constrained to `max-w-content` with token-based
 * horizontal padding and no fixed widths, so the section never produces
 * horizontal overflow on mobile. A decorative accent rail/markers sit inside
 * the padded column rather than extending the layout width.
 *
 * Rendered as a `<section id="experience">` labelled by its heading for an
 * accessible landmark name; entries form a semantic ordered list.
 */
export async function Timeline({
  experiences,
  eyebrow = EXPERIENCE_EYEBROW,
  heading = EXPERIENCE_HEADING,
  className,
}: TimelineProps) {
  const source = experiences ?? (await getExperiences());
  const entries = orderExperiences(source);
  const headingId = "experience-heading";

  return (
    <section
      id="experience"
      aria-labelledby={headingId}
      className={cn(
        "w-full bg-bg px-space-2 py-section sm:px-space-4",
        className,
      )}
    >
      <div className="mx-auto flex max-w-content flex-col gap-space-8">
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          heading={heading}
          align="center"
          className="mx-auto"
        />

        {entries.length > 0 ? (
          <Stagger
            as="ol"
            className={cn(
              // Single column at all breakpoints (Req 5.3 / Property 12).
              // A left accent rail is drawn as an inset border so it never
              // widens the layout; entries are inset to clear the markers.
              "relative flex flex-col gap-space-6",
              "border-l border-hairline pl-space-4 sm:pl-space-6",
            )}
          >
            {entries.map((entry) => {
              const titleId = `experience-${entry.id}-title`;
              const dateRange = formatDateRange(entry.startDate, entry.endDate);
              return (
                <FadeUp as="li" key={entry.id} className="relative list-none">
                  {/* Timeline marker — decorative, sits on the rail. The rail
                      is the list's left border; the marker is offset left of
                      the entry's content padding (space-4 = 32px / space-6 =
                      48px) by half its width to centre on the rail. */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full border border-accent bg-bg sm:-left-[53px]"
                  />
                  <Card
                    as="article"
                    aria-labelledby={titleId}
                    className="flex flex-col gap-space-3 p-space-4"
                  >
                    <header className="flex flex-col gap-space-1">
                      <h3
                        id={titleId}
                        className="font-display text-h3 font-semibold tracking-tight text-text text-balance"
                      >
                        {entry.position}
                      </h3>
                      <p className="font-sans text-body font-medium text-accent">
                        {entry.company}
                      </p>
                      <p className="font-sans text-caption uppercase tracking-widest text-muted">
                        {dateRange}
                      </p>
                    </header>

                    <p className="font-sans text-body text-text text-pretty">
                      {entry.impact}
                    </p>

                    {entry.achievements.length > 0 ? (
                      <div className="flex flex-col gap-space-1">
                        <h4 className="font-sans text-caption font-medium uppercase tracking-widest text-muted">
                          Key achievements
                        </h4>
                        <ul className="flex list-disc flex-col gap-space-1 pl-space-4 marker:text-accent">
                          {entry.achievements.map((achievement) => (
                            <li
                              key={achievement}
                              className="font-sans text-body text-muted text-pretty"
                            >
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </Card>
                </FadeUp>
              );
            })}
          </Stagger>
        ) : (
          <EmptyState
            title="Experience coming soon"
            description="Career history will appear here once it's published."
          />
        )}
      </div>
    </section>
  );
}
