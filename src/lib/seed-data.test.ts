import { describe, expect, it } from "vitest";
import { PostStatus, SkillCategory } from "@prisma/client";

import {
  experiences,
  posts,
  projects,
  skills,
  testimonials,
} from "../../prisma/seed-data";

// These tests assert the invariants the seed dataset must uphold so that the
// downstream feature sections (and their own tests) have data that exercises
// every branch. They run against the exported data only — no database needed.

describe("seed projects", () => {
  it("provides between 5 and 6 projects total", () => {
    expect(projects.length).toBeGreaterThanOrEqual(5);
    expect(projects.length).toBeLessThanOrEqual(6);
  });

  it("has between 3 and 6 featured projects (Requirement 10.5 / Property 1)", () => {
    const featured = projects.filter((p) => p.featured === true);
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.length).toBeLessThanOrEqual(6);
  });

  it("includes at least one non-featured project", () => {
    const nonFeatured = projects.filter((p) => !p.featured);
    expect(nonFeatured.length).toBeGreaterThanOrEqual(1);
  });

  it("gives featured projects distinct order values", () => {
    const orders = projects
      .filter((p) => p.featured === true)
      .map((p) => p.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("uses unique slugs across all projects", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("includes a project with both github and live links", () => {
    const both = projects.filter((p) => p.githubUrl && p.liveUrl);
    expect(both.length).toBeGreaterThanOrEqual(1);
  });

  it("includes a project missing at least one link (Requirement 3.3 / Property 2)", () => {
    const missingALink = projects.filter((p) => !p.githubUrl || !p.liveUrl);
    expect(missingALink.length).toBeGreaterThanOrEqual(1);
  });

  it("populates the narrative fields for every project", () => {
    for (const p of projects) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(0);
      expect(p.problem.length).toBeGreaterThan(0);
      expect(p.solution.length).toBeGreaterThan(0);
      expect(p.impact.length).toBeGreaterThan(0);
      const technologies = p.technologies as string[] | undefined;
      expect(technologies && technologies.length).toBeGreaterThan(0);
    }
  });
});

describe("seed skills", () => {
  it("covers all four skill categories (Requirement 4.1)", () => {
    const categories = new Set(skills.map((s) => s.category));
    expect(categories).toEqual(
      new Set([
        SkillCategory.FRONTEND,
        SkillCategory.BACKEND,
        SkillCategory.CLOUD,
        SkillCategory.AI,
      ]),
    );
  });

  it("keeps every proficiency within 0–100", () => {
    for (const s of skills) {
      expect(s.proficiency).toBeGreaterThanOrEqual(0);
      expect(s.proficiency).toBeLessThanOrEqual(100);
    }
  });

  it("includes the headline technologies named in the requirements", () => {
    const names = new Set(skills.map((s) => s.name));
    for (const expected of [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Vercel",
      "Neon",
      "Docker",
      "OpenAI",
      "LangChain",
      "RAG",
      "Vector Databases",
    ]) {
      expect(names.has(expected)).toBe(true);
    }
  });
});

describe("seed experience", () => {
  it("provides 3–4 entries", () => {
    expect(experiences.length).toBeGreaterThanOrEqual(3);
    expect(experiences.length).toBeLessThanOrEqual(4);
  });

  it("has exactly one current role (null endDate)", () => {
    const current = experiences.filter((e) => e.endDate === null);
    expect(current.length).toBe(1);
  });

  it("lists achievements for every entry", () => {
    for (const e of experiences) {
      const achievements = e.achievements as string[] | undefined;
      expect(achievements && achievements.length).toBeGreaterThan(0);
    }
  });
});

describe("seed testimonials", () => {
  it("provides 3–4 entries", () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    expect(testimonials.length).toBeLessThanOrEqual(4);
  });

  it("includes at least one testimonial with media", () => {
    const withMedia = testimonials.filter((t) => t.avatarUrl || t.logoUrl);
    expect(withMedia.length).toBeGreaterThanOrEqual(1);
  });

  it("includes at least one testimonial without any media (Requirement 6.2)", () => {
    const withoutMedia = testimonials.filter((t) => !t.avatarUrl && !t.logoUrl);
    expect(withoutMedia.length).toBeGreaterThanOrEqual(1);
  });
});

describe("seed posts", () => {
  it("includes at least one published post with a publishedAt date (Requirement 7.4)", () => {
    const published = posts.filter(
      (p) => p.status === PostStatus.PUBLISHED && p.publishedAt != null,
    );
    expect(published.length).toBeGreaterThanOrEqual(1);
  });

  it("includes at least one draft post (Requirement 7.4 / Property 3)", () => {
    const drafts = posts.filter((p) => p.status === PostStatus.DRAFT);
    expect(drafts.length).toBeGreaterThanOrEqual(1);
  });

  it("never assigns a publishedAt to a draft post", () => {
    const draftsWithDate = posts.filter(
      (p) => p.status === PostStatus.DRAFT && p.publishedAt != null,
    );
    expect(draftsWithDate.length).toBe(0);
  });

  it("uses unique slugs across all posts", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
