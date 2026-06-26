/**
 * Shared navigation data for the layout shell (Task 11).
 *
 * A single source of truth consumed by the desktop {@link Navbar}, the
 * {@link MobileNav} drawer, and the {@link Footer} quick links so the public
 * navigation never drifts out of sync. All section links are in-page hash
 * anchors that target the corresponding homepage sections.
 */

/** A navigation entry pointing to an in-page homepage section. */
export interface NavLink {
  readonly label: string;
  readonly href: string;
}

/** A social profile link rendered in the footer. */
export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Brand wordmark shown in the navbar and footer. Placeholder text until it is
 * wired to site/CMS configuration in a later milestone.
 */
export const BRAND_NAME = "Portfolio";

/**
 * Primary in-page section links shared across the navbar, mobile drawer, and
 * footer. Hash anchors smooth-scroll to the matching homepage sections.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

/** Prominent call-to-action surfaced in the navbar and mobile drawer. */
export const PRIMARY_CTA: NavLink = { label: "Get in touch", href: "#contact" };

/** Social profile placeholders (GitHub/LinkedIn) shown in the footer. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
];
