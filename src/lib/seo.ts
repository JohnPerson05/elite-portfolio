import type { Metadata } from "next";
import type { PostView } from "@/types";
import { HERO_CONTENT } from "@/features/hero/config";

const fallbackUrl = "http://localhost:3000";

export const siteConfig = {
  name: HERO_CONTENT.name,
  title: `${HERO_CONTENT.name} — ${HERO_CONTENT.role}`,
  description: HERO_CONTENT.valueProposition,
  locale: "en_US",
  avatar: HERO_CONTENT.avatarUrl,
} as const;

export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configured || fallbackUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.avatar,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: getSiteUrl().toString(),
    image: absoluteUrl(siteConfig.avatar),
    jobTitle: HERO_CONTENT.role,
    description: siteConfig.description,
    sameAs: HERO_CONTENT.links.map(({ href }) => href),
    knowsAbout: [
      "Java",
      "Spring Boot",
      "Microservices architecture",
      "REST API engineering",
      "React and Next.js",
      "Azure DevOps CI/CD",
      "Enterprise system integration",
      "MVP prototyping",
    ],
  };
}

export function blogPostingJsonLd(post: PostView) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    ...(post.coverUrl ? { image: absoluteUrl(post.coverUrl) } : {}),
    ...(post.publishedAt
      ? {
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
        }
      : {}),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: getSiteUrl().toString(),
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
