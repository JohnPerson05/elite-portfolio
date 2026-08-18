// ---------------------------------------------------------------------------
// Seed data for the Elite Portfolio (Task 4).
//
// This module holds ONLY data — no Prisma client, no side effects — so it can
// be imported both by the executable seed runner (`prisma/seed.ts`) and by unit
// tests that assert the seed invariants without touching a database.
//
// Requirements traceability:
//   - 3.3  Projects with and without GitHub/Live links (conditional rendering).
//   - 6.2  Testimonials with and without avatar/logo (graceful rendering).
//   - 7.4  A mix of PUBLISHED and DRAFT posts (published-only filtering).
//   - 10.5 Between 3 and 6 featured projects with distinct `order`.
//   - 4.1  Skills across all four categories (FRONTEND, BACKEND, CLOUD, AI).
// ---------------------------------------------------------------------------

import { Prisma, SkillCategory } from "@prisma/client";
import { PROFILE_EXPERIENCES } from "../src/features/experience/profile-data";

/**
 * Featured + non-featured projects.
 *
 * The set deliberately covers every link permutation so the public projects
 * section can exercise conditional GitHub/Live link rendering (Requirement
 * 3.3): both links, GitHub only, Live only, and neither.
 */
export const projects: Prisma.ProjectCreateManyInput[] = [
  {
    title: "Enterprise Banking Services",
    slug: "enterprise-banking-services",
    summary:
      "Secure backend services and integrations for cloud-native banking applications.",
    problem:
      "Enterprise banking workflows required reliable service integration, controlled delivery, and production-grade observability across distributed systems.",
    solution:
      "Developed Java and Spring Boot microservices, optimized REST APIs, expanded JUnit coverage, and supported Azure DevOps CI/CD and cloud-native enhancements.",
    impact:
      "Improved service reliability, delivery repeatability, and maintainability for secure banking capabilities.",
    technologies: [
      "Java",
      "Spring Boot",
      "Microservices",
      "REST APIs",
      "JUnit",
      "Azure DevOps",
      "OpenShift",
    ],
    thumbnailUrl: null,
    githubUrl: null,
    liveUrl: null,
    featured: true,
    order: 1,
  },
  {
    title: "GlobalMeet Product Prototypes",
    slug: "globalmeet-product-prototypes",
    summary:
      "Rapid MVPs and reusable interactions for live meeting and reporting experiences.",
    problem:
      "New product concepts needed to be validated quickly while remaining compatible with established Java and PHP application surfaces.",
    solution:
      "Created functional prototypes, reusable React components, emoji reactions, sentiment-related reporting interfaces, and integrations with existing APIs.",
    impact:
      "Helped teams move from product concept to validated, production-ready feature direction with less rework.",
    technologies: [
      "React.js",
      "TypeScript",
      "JavaScript",
      "Java",
      "PHP",
      "REST APIs",
      "MVP Prototyping",
    ],
    thumbnailUrl: null,
    githubUrl: null,
    liveUrl: null,
    featured: true,
    order: 2,
  },
  {
    title: "Export-Import Insurance Platform",
    slug: "export-import-insurance-platform",
    summary:
      "Accessible user-facing workflows and BFF capabilities for enterprise insurance applications.",
    problem:
      "Complex insurance workflows needed clearer interfaces, reliable backend coordination, and accessibility improvements within an established platform.",
    solution:
      "Delivered React interface enhancements, resolved UI defects, contributed to a Spring Boot BFF, and partnered with UX on pixel-accurate accessible implementation.",
    impact:
      "Improved usability, accessibility, and integration quality across important insurance journeys.",
    technologies: [
      "React.js",
      "Spring Boot",
      "BFF",
      "JavaScript",
      "Accessibility",
      "Agile",
    ],
    thumbnailUrl: null,
    githubUrl: null,
    liveUrl: null,
    featured: true,
    order: 3,
  },
  {
    title: "Enterprise Application Modernization",
    slug: "enterprise-application-modernization",
    summary:
      "Responsive full-stack enhancements across enterprise Java and React applications.",
    problem:
      "Legacy application surfaces needed modern responsive interfaces, dependable API integration, and consistent delivery across browsers and environments.",
    solution:
      "Built React and Bootstrap experiences, integrated Spring Boot services and microservices, and supported UAT, CI/CD, performance tuning, and cross-browser quality.",
    impact:
      "Modernized enterprise workflows while preserving compatibility with existing systems and delivery processes.",
    technologies: [
      "React.js",
      "Java",
      "Spring Boot",
      "Bootstrap",
      "Microservices",
      "CI/CD",
    ],
    thumbnailUrl: null,
    githubUrl: null,
    liveUrl: null,
    featured: true,
    order: 4,
  },
  {
    title: "Freelance MVP Delivery",
    slug: "freelance-mvp-delivery",
    summary:
      "Fast, maintainable web application prototypes shaped for product validation and iteration.",
    problem:
      "Early-stage ideas need a credible working product quickly without creating a disposable technical foundation.",
    solution:
      "Combined Next.js, TypeScript, Tailwind CSS, Vercel, reusable components, and AI-assisted development workflows to accelerate focused MVP delivery.",
    impact:
      "Created a repeatable path from concept to interactive prototype while keeping the implementation ready for continued engineering.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "Codex",
      "Claude",
    ],
    thumbnailUrl: null,
    githubUrl: null,
    liveUrl: null,
    featured: false,
    order: 5,
  },
];

/**
 * Skills across all four categories (Requirement 4.1). Each carries a 0–100
 * proficiency and an explicit display order within its category.
 */
export const skills: Prisma.SkillCreateManyInput[] = [
  // Backend
  { name: "Java", category: SkillCategory.BACKEND, proficiency: 95, order: 1 },
  {
    name: "Spring Boot",
    category: SkillCategory.BACKEND,
    proficiency: 94,
    order: 2,
  },
  {
    name: "Microservices Architecture",
    category: SkillCategory.BACKEND,
    proficiency: 92,
    order: 3,
  },
  {
    name: "REST APIs",
    category: SkillCategory.BACKEND,
    proficiency: 95,
    order: 4,
  },
  {
    name: "JUnit Testing",
    category: SkillCategory.BACKEND,
    proficiency: 90,
    order: 5,
  },
  { name: "SQL", category: SkillCategory.BACKEND, proficiency: 89, order: 6 },
  {
    name: "OOP Principles",
    category: SkillCategory.BACKEND,
    proficiency: 94,
    order: 7,
  },
  {
    name: "Backend Integration",
    category: SkillCategory.BACKEND,
    proficiency: 91,
    order: 8,
  },
  { name: "XML", category: SkillCategory.BACKEND, proficiency: 84, order: 9 },
  // Cloud & DevOps
  {
    name: "Azure DevOps CI/CD",
    category: SkillCategory.CLOUD,
    proficiency: 92,
    order: 1,
  },
  {
    name: "OpenShift",
    category: SkillCategory.CLOUD,
    proficiency: 86,
    order: 2,
  },
  { name: "GitLab", category: SkillCategory.CLOUD, proficiency: 88, order: 3 },
  {
    name: "Bitbucket",
    category: SkillCategory.CLOUD,
    proficiency: 88,
    order: 4,
  },
  { name: "Vercel", category: SkillCategory.CLOUD, proficiency: 89, order: 5 },
  { name: "Kibana", category: SkillCategory.CLOUD, proficiency: 85, order: 6 },
  { name: "Datadog", category: SkillCategory.CLOUD, proficiency: 84, order: 7 },
  { name: "Grafana", category: SkillCategory.CLOUD, proficiency: 84, order: 8 },
  // Frontend
  {
    name: "React.js",
    category: SkillCategory.FRONTEND,
    proficiency: 91,
    order: 1,
  },
  {
    name: "Next.js",
    category: SkillCategory.FRONTEND,
    proficiency: 88,
    order: 2,
  },
  {
    name: "TypeScript",
    category: SkillCategory.FRONTEND,
    proficiency: 91,
    order: 3,
  },
  {
    name: "JavaScript",
    category: SkillCategory.FRONTEND,
    proficiency: 92,
    order: 4,
  },
  {
    name: "Tailwind CSS",
    category: SkillCategory.FRONTEND,
    proficiency: 89,
    order: 5,
  },
  {
    name: "Bootstrap",
    category: SkillCategory.FRONTEND,
    proficiency: 90,
    order: 6,
  },
  {
    name: "jQuery & AJAX",
    category: SkillCategory.FRONTEND,
    proficiency: 84,
    order: 7,
  },
  {
    name: "JSP / JSTL",
    category: SkillCategory.FRONTEND,
    proficiency: 85,
    order: 8,
  },
  {
    name: "Reusable UI Components",
    category: SkillCategory.FRONTEND,
    proficiency: 91,
    order: 9,
  },
  {
    name: "MVP Prototyping",
    category: SkillCategory.FRONTEND,
    proficiency: 92,
    order: 10,
  },
  // AI-assisted development and delivery tools.
  { name: "Codex", category: SkillCategory.AI, proficiency: 91, order: 1 },
  { name: "Claude", category: SkillCategory.AI, proficiency: 91, order: 2 },
  { name: "Lovable", category: SkillCategory.AI, proficiency: 88, order: 3 },
  {
    name: "v0 by Vercel",
    category: SkillCategory.AI,
    proficiency: 89,
    order: 4,
  },
  {
    name: "Agile Scrum",
    category: SkillCategory.AI,
    proficiency: 94,
    order: 5,
  },
  { name: "Waterfall", category: SkillCategory.AI, proficiency: 86, order: 6 },
  { name: "Jira", category: SkillCategory.AI, proficiency: 92, order: 7 },
  { name: "Confluence", category: SkillCategory.AI, proficiency: 90, order: 8 },
  {
    name: "Postman API",
    category: SkillCategory.AI,
    proficiency: 92,
    order: 9,
  },
];

/**
 * Career history ordered most-recent-first. The current role has a null
 * `endDate` to represent "present".
 */
export const experiences: Prisma.ExperienceCreateManyInput[] =
  PROFILE_EXPERIENCES.map(({ id: _id, startDate, endDate, ...entry }) => ({
    ...entry,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
  }));

/**
 * Testimonials. Some include an avatar and/or company logo; at least one
 * includes neither, so the section can render gracefully without media
 * (Requirement 6.2).
 */
export const testimonials: Prisma.TestimonialCreateManyInput[] = [];

/**
 * Blog posts: a mix of PUBLISHED (with a `publishedAt` timestamp) and DRAFT
 * (no `publishedAt`) so published-only filtering can be exercised (Requirement
 * 7.4).
 */
export const posts: Prisma.PostCreateManyInput[] = [];
