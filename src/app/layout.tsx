import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/motion";
import { ToastProvider } from "@/components/ui";
import {
  Footer,
  Navbar,
  RouteTransition,
  ThemeBackground,
} from "@/components/layout";
import "./globals.css";

// Self-hosted via next/font: fonts are downloaded at build time and served
// from the app (no runtime requests to a third party), with an automatic
// size-adjusted fallback for zero layout shift (no FOUT/CLS).

// High-legibility body sans.
const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// Refined display/grotesk for headings.
const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Elite Portfolio",
  description:
    "A premium portfolio showcasing elite engineering work. (Scaffold)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      {/*
       * `overflow-x-hidden` on the body is a defensive guard against any
       * section producing horizontal scroll (Correctness Property 12 / Req
       * 16.1); individual sections still own their own responsive layout.
       */}
      <body className="overflow-x-hidden bg-bg text-text antialiased">
        <MotionProvider>
          <ToastProvider>
            {/* Decorative depth layer, fixed behind all content. */}
            <ThemeBackground />

            {/*
             * Skip link: the first focusable element on the page. Visually
             * hidden until focused, then revealed so keyboard users can jump
             * straight to the main content (accessibility best practice).
             */}
            <a
              href="#main-content"
              className="sr-only z-50 rounded-md bg-card px-space-2 py-space-1 text-body text-text focus:not-sr-only focus:fixed focus:left-space-2 focus:top-space-2 focus:outline-2 focus:outline-offset-2 focus:outline-accent"
            >
              Skip to content
            </a>

            <Navbar />

            <main id="main-content">
              <RouteTransition>{children}</RouteTransition>
            </main>

            <Footer />
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
