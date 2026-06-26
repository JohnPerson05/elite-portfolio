import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article, getPublishedPostBySlug } from "@/features/blog";

interface BlogArticlePageProps {
  /** Route params. In Next.js 15 `params` is async and must be awaited. */
  params: Promise<{ slug: string }>;
}

/**
 * Minimal per-article metadata derived from the published post. Returns the
 * default title for a missing/unpublished slug (the page itself renders the
 * 404). Full SEO — Open Graph, Twitter cards, and `BlogPosting` JSON-LD — lands
 * in Task 26.
 */
export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

/**
 * `/blog/[slug]` — the public single-article page (Requirements 7.3, 7.4).
 *
 * A React Server Component that resolves the post via
 * {@link getPublishedPostBySlug}, which returns a post only when it exists AND
 * is `PUBLISHED`. A missing slug or a `DRAFT` post yields `null`, in which case
 * we call `notFound()` to render the 404 — a draft is never reachable publicly
 * (Correctness Property 3 / Requirement 7.4).
 *
 * The root layout owns the single `<main>` landmark; this delegates the article
 * render to {@link Article}.
 */
export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <Article post={post} />;
}
