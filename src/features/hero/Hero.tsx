import Image from "next/image";
import { FadeUp, Stagger } from "@/components/motion";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { HERO_CONTENT, type HeroContent, type HeroLink } from "./config";
import { MagneticCta } from "./MagneticCta";

/**
 * Props for {@link Hero}. Every field is optional and falls back to
 * {@link HERO_CONTENT}, so the section renders complete content out of the box
 * while remaining fully overridable (today via props, later via a CMS source
 * that maps onto this same shape).
 */
export interface HeroProps {
  /** Full name — rendered as the page `<h1>` and the avatar's alt text. */
  name?: string;
  /** Professional role/title. */
  role?: string;
  /** Short value proposition shown beneath the role. */
  valueProposition?: string;
  /** Avatar image path/URL (binary need not exist for tests). */
  avatarUrl?: string;
  /** Override the "View Projects" CTA target (Req 1.4). */
  projectsHref?: string;
  /** Override the "Download Resume" CTA target (Req 1.5). */
  resumeHref?: string;
  /** Override the "Contact Me" CTA target (Req 1.6). */
  contactHref?: string;
  /** Optional secondary links. */
  links?: readonly HeroLink[];
  className?: string;
}

/** Resolve incoming props against the default content. */
function resolveContent(props: HeroProps): HeroContent {
  return {
    name: props.name ?? HERO_CONTENT.name,
    role: props.role ?? HERO_CONTENT.role,
    valueProposition: props.valueProposition ?? HERO_CONTENT.valueProposition,
    avatarUrl: props.avatarUrl ?? HERO_CONTENT.avatarUrl,
    projectsHref: props.projectsHref ?? HERO_CONTENT.projectsHref,
    resumeHref: props.resumeHref ?? HERO_CONTENT.resumeHref,
    contactHref: props.contactHref ?? HERO_CONTENT.contactHref,
    links: props.links ?? HERO_CONTENT.links,
  };
}

/**
 * `Hero` — the full-screen opening section of the homepage (Requirement 1).
 *
 * Content (Req 1.1): a professional avatar, the candidate's name as the page
 * `<h1>`, their role, and a short value proposition. Three primary CTAs (Req
 * 1.2) link to the projects section (`#projects`, Req 1.4), the resume route
 * (`/resume`, Req 1.5), and the contact section (`#contact`, Req 1.6). The
 * primary CTA is magnetic for a premium feel.
 *
 * Motion (Req 1.3): a single {@link Stagger} orchestrates subtle fade-up
 * reveals of the text block, CTAs, and avatar — no bouncy effects. All motion
 * is reduced-motion aware via the shared primitives (Property 9 / Req 15.4).
 *
 * Layout (Req 1.7 / Property 12): mobile-first single column that stacks the
 * copy above the avatar, expanding to a two-column layout from `lg`. The
 * section fills the viewport height minus the 4rem (`h-16`) sticky navbar and
 * never produces horizontal overflow.
 *
 * Landmark: rendered as a `<section id="top">` (the navbar brand links to
 * `#top`) labelled by the `<h1>`. It is a Server Component; only the motion
 * wrappers and magnetic CTA hydrate as client islands.
 */
export function Hero(props: HeroProps) {
  const content = resolveContent(props);
  const headingId = "hero-heading";

  return (
    <section
      id="top"
      aria-labelledby={headingId}
      className={cn(
        // Fill the viewport minus the sticky navbar (h-16 = 4rem).
        "relative flex min-h-[calc(100svh-4rem)] w-full items-center",
        "px-space-2 py-space-12 sm:px-space-4",
        props.className,
      )}
    >
      <Stagger
        className={cn(
          "mx-auto grid w-full max-w-content items-center gap-space-8",
          "lg:grid-cols-[1.25fr_1fr]",
        )}
      >
        {/* Copy + CTAs. Order-2 on mobile keeps the avatar on top when stacked. */}
        <div className="flex flex-col items-start gap-space-3 lg:order-1">
          <FadeUp>
            <p className="font-sans text-caption font-medium uppercase tracking-widest text-accent">
              {content.role}
            </p>
          </FadeUp>

          <FadeUp>
            <h1
              id={headingId}
              className="font-display text-hero font-bold tracking-tight text-text text-balance"
            >
              {content.name}
            </h1>
          </FadeUp>

          <FadeUp>
            <p className="max-w-content font-sans text-body-lg text-muted text-pretty">
              {content.valueProposition}
            </p>
          </FadeUp>

          {/* Three primary CTAs (Req 1.2). Wrap so they stack cleanly on
              mobile and stay full-width-friendly for touch (Req 1.7). */}
          <FadeUp className="w-full">
            <div className="flex flex-col flex-wrap gap-space-2 sm:flex-row sm:items-center">
              <MagneticCta>
                <Button href={content.projectsHref} variant="primary" size="lg">
                  View Projects
                </Button>
              </MagneticCta>

              <Button href={content.resumeHref} variant="outline" size="lg">
                Download Resume
              </Button>

              <Button href={content.contactHref} variant="ghost" size="lg">
                Contact Me
              </Button>
            </div>
          </FadeUp>

          {content.links.length > 0 ? (
            <FadeUp className="w-full">
              <ul className="flex flex-wrap items-center gap-space-3 pt-space-1">
                {content.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-md text-body text-muted",
                        "transition-colors hover:text-text",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FadeUp>
          ) : null}
        </div>

        {/* Professional avatar. Priority + explicit dimensions for a stable
            LCP with no layout shift (Req 1.1, 15.3). */}
        <FadeUp className="lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-hairline bg-card">
            <Image
              src={content.avatarUrl}
              alt={content.name}
              width={640}
              height={640}
              priority
              sizes="(max-width: 1024px) 80vw, 33vw"
              className="h-full w-full object-cover"
            />
          </div>
        </FadeUp>
      </Stagger>
    </section>
  );
}
