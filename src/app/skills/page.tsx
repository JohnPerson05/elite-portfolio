import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { Skills } from "@/features/skills";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Capabilities",
  description:
    "Product engineering capabilities spanning interfaces, backend systems, cloud platforms, and AI.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Capabilities"
        title="One partner from concept to production."
        description="Product thinking, interface craft, systems engineering, and delivery discipline brought together to create experiences that feel sharp and operate reliably."
      />
      <Skills
        eyebrow="Engineering matrix"
        heading="Enterprise skills, proven in delivery"
        showDetailLink={false}
        className="bg-transparent"
      />
    </>
  );
}
