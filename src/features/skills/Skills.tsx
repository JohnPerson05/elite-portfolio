import { FadeUp, Stagger } from "@/components/motion";
import { Card, EmptyState, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { SkillView } from "@/types";
import {
  SKILLS_EYEBROW,
  SKILLS_HEADING,
  groupSkills,
} from "./config";
import { getSkills } from "./data";
import { ProficiencyBar } from "./ProficiencyBar";

export interface SkillsProps {
  /**
   * Override the skills rendered. Defaults to a live query of all skills.
   * Primarily an injection seam for tests; production renders the live data
   * fetched from the shared Prisma client. The injected list is still run
   * through {@link groupSkills} so the four-category grouping and per-group
   * ordering (Requirement 4.1) hold either way.
   */
  skills?: readonly SkillView[];
  /** Eyebrow label above the heading. */
  eyebrow?: string;
  /** Section heading text. */
  heading?: string;
  className?: string;
}

/**
 * `Skills` — the homepage skills section (Requirement 4).
 *
 * A React Server Component: it fetches skills via the shared Prisma client
 * ({@link getSkills}) and groups them into the four {@link SkillCategory}
 * buckets — Frontend, Backend, Cloud, AI — via {@link groupSkills}, each group's
 * skills ordered by `order` ascending (Requirement 4.1). All four categories
 * render as groups even if a category has no skills, so the section structure
 * is deterministic.
 *
 * Each skill renders an animated {@link ProficiencyBar} (Requirement 4.2) that
 * fills from 0 to its target on in-view (Requirement 4.3) and shows the final
 * value immediately under reduced motion (Requirement 4.4 / Correctness
 * Property 9), via the shared in-view/count-up primitives.
 *
 * Motion (Requirement 4.3): a {@link Stagger} container orchestrates staggered
 * scroll-triggered reveals of each category group (wrapped in {@link FadeUp}),
 * honoring reduced motion via the shared primitives.
 *
 * Rendered as a `<section id="skills">` labelled by its heading for an
 * accessible landmark name. Each category group is itself a labelled region.
 */
export async function Skills({
  skills,
  eyebrow = SKILLS_EYEBROW,
  heading = SKILLS_HEADING,
  className,
}: SkillsProps) {
  const source = skills ?? (await getSkills());
  const groups = groupSkills(source);
  const headingId = "skills-heading";
  const hasAnySkill = groups.some((group) => group.skills.length > 0);

  return (
    <section
      id="skills"
      aria-labelledby={headingId}
      className={cn(
        "w-full bg-bg-secondary px-space-2 py-section sm:px-space-4",
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

        {hasAnySkill ? (
          <Stagger
            as="ul"
            className={cn(
              "grid grid-cols-1 gap-space-3 sm:gap-space-4",
              "md:grid-cols-2",
            )}
          >
            {groups.map((group) => {
              const groupHeadingId = `skills-${group.category.toLowerCase()}-heading`;
              return (
                <FadeUp
                  as="li"
                  key={group.category}
                  className="h-full list-none"
                >
                  <Card
                    as="section"
                    aria-labelledby={groupHeadingId}
                    className="flex h-full flex-col gap-space-4 p-space-4"
                  >
                    <h3
                      id={groupHeadingId}
                      className="font-display text-h3 font-semibold tracking-tight text-text"
                    >
                      {group.label}
                    </h3>
                    {group.skills.length > 0 ? (
                      <ul className="flex flex-col gap-space-3">
                        {group.skills.map((skill) => (
                          <li key={skill.id}>
                            <ProficiencyBar
                              name={skill.name}
                              proficiency={skill.proficiency}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-sans text-body text-muted">
                        Coming soon.
                      </p>
                    )}
                  </Card>
                </FadeUp>
              );
            })}
          </Stagger>
        ) : (
          <EmptyState
            title="Skills coming soon"
            description="Technical skills will appear here once they're published."
          />
        )}
      </div>
    </section>
  );
}
