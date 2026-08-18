import type { Metadata } from "next";
import { FadeUp, Stagger } from "@/components/motion";
import { Card, PageHero } from "@/components/ui";
import { TrustStats } from "@/features/trust";
import { createPageMetadata } from "@/lib/seo";

const PRINCIPLES = [
  {
    number: "01",
    title: "Clarity before code",
    body: "Align the product goal, user need, and technical constraints before increasing delivery speed.",
  },
  {
    number: "02",
    title: "Interaction with purpose",
    body: "Motion and detail should explain state, create confidence, and make the product easier to use.",
  },
  {
    number: "03",
    title: "Built to keep working",
    body: "Maintainability, performance, accessibility, and observability are product features—not cleanup.",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "John Person Narral is a backend and full-stack engineer focused on enterprise Java systems, modern web products, and rapid MVP delivery.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="00"
        eyebrow="About John"
        title="Enterprise engineering with full-stack range."
        description="I am John Person Narral, a backend and full-stack engineer and freelancer with approximately six years of experience across banking, insurance, live-meeting products, enterprise modernization, and rapid MVP delivery."
      />
      <TrustStats showDetailLink={false} className="bg-transparent" />
      <section className="border-t border-hairline px-space-2 py-section sm:px-space-4">
        <Stagger
          as="ul"
          className="mx-auto grid max-w-content gap-space-3 md:grid-cols-3"
        >
          {PRINCIPLES.map((principle) => (
            <FadeUp as="li" key={principle.number} className="h-full list-none">
              <Card className="h-full p-space-4">
                <span className="font-mono text-caption text-accent">
                  {principle.number}
                </span>
                <h2 className="mt-space-6 font-display text-h3 font-semibold text-text">
                  {principle.title}
                </h2>
                <p className="mt-space-2 text-pretty text-body text-muted">
                  {principle.body}
                </p>
              </Card>
            </FadeUp>
          ))}
        </Stagger>
      </section>
    </>
  );
}
