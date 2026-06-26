"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /**
   * Once the element has entered the viewport, stay "in view" even after it
   * scrolls back out. Defaults to `true` so reveal animations don't replay.
   */
  once?: boolean;
  /**
   * Margin around the root, forwarded to IntersectionObserver `rootMargin`.
   * A negative bottom margin makes elements reveal slightly before fully
   * entering the viewport.
   */
  rootMargin?: string;
  /** Visibility ratio (0–1) at which the element counts as in view. */
  amount?: number;
}

export interface UseInViewResult<T extends Element> {
  /** Attach to the element you want to observe. */
  ref: React.RefObject<T | null>;
  /** Whether the element is currently considered in view. */
  inView: boolean;
}

/**
 * Observe whether an element has entered the viewport using
 * IntersectionObserver, returning a `ref` to attach and an `inView` boolean.
 *
 * SSR-safe and resilient to environments without IntersectionObserver (e.g.
 * older jsdom): in that case it reports `inView = true` so content is never
 * permanently hidden.
 */
export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {},
): UseInViewResult<T> {
  const { once = true, rootMargin = "0px 0px -10% 0px", amount = 0.2 } =
    options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fallback: if IntersectionObserver is unavailable, treat as visible so
    // content (and its final state) is always shown.
    if (
      typeof window === "undefined" ||
      typeof window.IntersectionObserver !== "function"
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold: amount },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, amount]);

  return { ref, inView };
}
