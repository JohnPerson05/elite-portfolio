import type { Metadata } from "next";

import { EmptyState, SectionHeading } from "@/components/ui";
import {
  CONTACTS_DESCRIPTION,
  CONTACTS_EMPTY_DESCRIPTION,
  CONTACTS_EMPTY_TITLE,
  CONTACTS_EYEBROW,
  CONTACTS_HEADING,
  CONTACTS_NO_COMPANY,
  formatSubmittedAt,
  getContactSubmissions,
} from "@/features/admin/contacts";

export const metadata: Metadata = {
  title: "Contact submissions",
};

/**
 * `/admin/contacts` — the owner's view of contact form submissions
 * (Requirement 12).
 *
 * GUARD (Requirement 9.1 / Correctness Property 7): this page lives under the
 * `app/admin/(protected)` route group, so it inherits the guarded admin layout
 * whose `requireSession()` redirects unauthenticated requests to `/admin/login`
 * before any of this content is rendered. The route group does not affect the
 * URL, so this still resolves to `/admin/contacts` (matching the `AdminNav`
 * link). No data is fetched or exposed without a valid session.
 *
 * A Server Component that reads every submission via
 * {@link getContactSubmissions} — ordered most-recent-first (Requirement 12.3 /
 * Correctness Property 10) — and lists name, email, company, message, and
 * timestamp (Requirement 12.1). When there are no submissions it renders an
 * {@link EmptyState} (Requirement 12.2).
 *
 * Accessibility: rendered as a `<section>` labelled by its heading; submissions
 * use a real `<table>` with scoped column headers and a `<caption>` so the data
 * has accessible structure. The `<main>` landmark is owned by the admin layout.
 */
export default async function AdminContactsPage() {
  const submissions = await getContactSubmissions();
  const headingId = "admin-contacts-heading";

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-space-6">
      <SectionHeading
        id={headingId}
        level={1}
        eyebrow={CONTACTS_EYEBROW}
        heading={CONTACTS_HEADING}
        description={CONTACTS_DESCRIPTION}
      />

      {submissions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-card">
          <table className="w-full border-collapse text-left text-body">
            <caption className="sr-only">
              {`Contact submissions, most recent first (${submissions.length} total).`}
            </caption>
            <thead>
              <tr className="border-b border-hairline text-caption uppercase tracking-widest text-muted">
                <th scope="col" className="px-space-3 py-space-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-space-3 py-space-3 font-medium">
                  Email
                </th>
                <th scope="col" className="px-space-3 py-space-3 font-medium">
                  Company
                </th>
                <th scope="col" className="px-space-3 py-space-3 font-medium">
                  Message
                </th>
                <th scope="col" className="px-space-3 py-space-3 font-medium">
                  Received
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b border-hairline align-top last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-space-3 py-space-3 font-medium text-text"
                  >
                    {submission.name}
                  </th>
                  <td className="px-space-3 py-space-3 text-muted">
                    <a
                      href={`mailto:${submission.email}`}
                      className="rounded-sm text-muted underline-offset-2 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {submission.email}
                    </a>
                  </td>
                  <td className="px-space-3 py-space-3 text-muted">
                    {submission.company ?? CONTACTS_NO_COMPANY}
                  </td>
                  <td className="max-w-prose text-pretty px-space-3 py-space-3 text-text">
                    {submission.message}
                  </td>
                  <td className="whitespace-nowrap px-space-3 py-space-3 text-muted">
                    <time dateTime={submission.submittedAt}>
                      {formatSubmittedAt(submission.submittedAt)}
                    </time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title={CONTACTS_EMPTY_TITLE}
          description={CONTACTS_EMPTY_DESCRIPTION}
        />
      )}
    </section>
  );
}
