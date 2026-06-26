import Image from "next/image";
import { FadeUp, Stagger } from "@/components/motion";
import { Card, EmptyState, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { TestimonialView } from "@/types";
import {
  TESTIMONIALS_EYEBROW,
  TESTIMONIALS_HEADING,
  hasMedia,
  orderTestimonials,
} from "./config";
import { getTestimonials } from "./data";

export interface TestimonialsProps {
  /**
   * Override the testimonials rendered. Defaults to a live query of all
   * testimonials. Primarily an injection seam for tests; production renders the
   * live data fetched from the shared Prisma client. The injected list is still
   * run through {@link orderTestimonials} so the display-ordering invariant
   * (Requirement 6.1) holds either way.
   */
  testimonials?: readonly TestimonialView[];
  /** Eyebrow label above the heading. */
  eyebrow?: string;
  /** Section heading text. */
  heading?: string;
  className?: string;
}

/**
 * `Testimonials` — the homepage testimonials section (Requirement 6).
 *
 * A React Server Component: it fetches endorsements via the shared Prisma
 * client ({@link getTestimonials}), ordered by `order` ascending, and renders
 * each as a card showing the quote, author name, and author role/company
 * (Requirement 6.1). Callers may inject a `testimonials` array (used by tests);
 * the injected list is still run through {@link orderTestimonials} so the
 * ordering invariant holds either way.
 *
 * Optional media (Requirement 6.2): an author profile photo (`avatarUrl`) and a
 * company logo (`logoUrl`) are rendered via `next/image` if and only if their
 * URL is non-empty (via {@link hasMedia}); when absent, the card renders
 * gracefully without them and the layout stays intact — no broken/empty image.
 *
 * Motion (Requirement 6.3): a {@link Stagger} container orchestrates staggered
 * scroll-triggered reveals of the cards (each wrapped in {@link FadeUp}),
 * honoring reduced motion via the shared primitives (Correctness Property 9).
 *
 * Rendered as a `<section id="testimonials">` labelled by its heading for an
 * accessible landmark name; each card is a semantic
 * `<figure>`/`<blockquote>`/`<figcaption>`.
 */
export async function Testimonials({
  testimonials,
  eyebrow = TESTIMONIALS_EYEBROW,
  heading = TESTIMONIALS_HEADING,
  className,
}: TestimonialsProps) {
  const source = testimonials ?? (await getTestimonials());
  const entries = orderTestimonials(source);
  const headingId = "testimonials-heading";

  return (
    <section
      id="testimonials"
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

        {entries.length > 0 ? (
          <Stagger
            as="ul"
            className={cn(
              "grid grid-cols-1 gap-space-3 sm:gap-space-4",
              "md:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {entries.map((testimonial) => {
              const authorId = `testimonial-${testimonial.id}-author`;
              const showAvatar = hasMedia(testimonial.avatarUrl);
              const showLogo = hasMedia(testimonial.logoUrl);

              return (
                <FadeUp
                  as="li"
                  key={testimonial.id}
                  className="h-full list-none"
                >
                  <Card
                    as="figure"
                    hover="lift"
                    aria-labelledby={authorId}
                    className="flex h-full flex-col gap-space-4 p-space-4"
                  >
                    <blockquote className="font-sans text-body-lg text-text text-pretty">
                      <p>&ldquo;{testimonial.quote}&rdquo;</p>
                    </blockquote>

                    <figcaption className="mt-auto flex items-center gap-space-3">
                      {showAvatar ? (
                        <Image
                          src={testimonial.avatarUrl as string}
                          alt={`Photo of ${testimonial.author}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-full border border-hairline object-cover"
                        />
                      ) : null}

                      <div className="flex min-w-0 flex-col">
                        <span
                          id={authorId}
                          className="font-display text-body font-semibold text-text"
                        >
                          {testimonial.author}
                        </span>
                        <span className="font-sans text-caption text-muted text-pretty">
                          {testimonial.company
                            ? `${testimonial.role}, ${testimonial.company}`
                            : testimonial.role}
                        </span>
                      </div>

                      {showLogo ? (
                        <Image
                          src={testimonial.logoUrl as string}
                          alt={
                            testimonial.company
                              ? `${testimonial.company} logo`
                              : `${testimonial.author} company logo`
                          }
                          width={96}
                          height={32}
                          className="ml-auto h-8 w-auto shrink-0 object-contain opacity-80"
                        />
                      ) : null}
                    </figcaption>
                  </Card>
                </FadeUp>
              );
            })}
          </Stagger>
        ) : (
          <EmptyState
            title="Testimonials coming soon"
            description="Endorsements will appear here once they're published."
          />
        )}
      </div>
    </section>
  );
}
