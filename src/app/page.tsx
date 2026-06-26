import { PageViewTracker } from "@/components/analytics";
import { Hero } from "@/features/hero";
import { TrustStats } from "@/features/trust";
import { FeaturedProjects } from "@/features/projects";
import { Skills } from "@/features/skills";
import { Timeline } from "@/features/experience";
import { Testimonials } from "@/features/testimonials";
import { BlogPreview } from "@/features/blog";
import { ContactForm } from "@/features/contact";

/**
 * Homepage — the full recruiter-optimized composition of every public feature
 * section (Task 20; Requirement 1.5 surfaced via the Hero's resume CTA).
 *
 * Section order is deliberately conversion-first, answering "why hire this
 * person?" top to bottom: open with identity + CTAs (Hero), establish
 * credibility (TrustStats), prove it with the strongest work (FeaturedProjects)
 * and capabilities (Skills), show the trajectory (Timeline/Experience), add
 * social proof (Testimonials), demonstrate thought leadership (BlogPreview),
 * and close with the conversion action (ContactForm).
 *
 * `FeaturedProjects`, `Skills`, `Timeline`, `Testimonials`, and `BlogPreview`
 * are async Server Components that fetch their own data via the shared Prisma
 * client, so they are composed directly with `@ts-expect-error`-free JSX (React
 * 19 / Next 15 support awaiting async Server Components in the tree).
 *
 * Analytics (Requirement 13.1; Correctness Properties 5 & 6): a single
 * {@link PageViewTracker} client island records one `PORTFOLIO_VIEW` event from
 * a mount effect after hydration. It renders nothing and never blocks paint —
 * the page's HTML streams independently of analytics.
 *
 * The root layout (`app/layout.tsx`) owns the single `<main>` landmark plus the
 * navbar/footer and the `MotionProvider`/`RouteTransition` providers, so this
 * page returns a fragment of `<section>` landmarks rather than its own `<main>`
 * or duplicate providers.
 */
export default function Home() {
  return (
    <>
      <PageViewTracker path="/" />

      <Hero />
      <TrustStats />
      <FeaturedProjects />
      <Skills />
      <Timeline />
      <Testimonials />
      <BlogPreview />
      <ContactForm />
    </>
  );
}
