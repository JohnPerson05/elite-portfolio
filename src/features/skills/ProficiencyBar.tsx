"use client";

import { useInView } from "@/hooks/useInView";
import { useCounter } from "@/hooks/useCounter";
import { cn } from "@/lib/utils";
import {
  MAX_PROFICIENCY,
  MIN_PROFICIENCY,
  clampProficiency,
} from "./config";

export interface ProficiencyBarProps {
  /** Skill name shown as the bar's label and used for its accessible name. */
  name: string;
  /** Target proficiency level, 0–100. */
  proficiency: number;
  className?: string;
}

/**
 * `ProficiencyBar` — an animated skill proficiency indicator (Requirement 4.2).
 *
 * The fill grows from 0 up to the skill's target level when the bar scrolls
 * into view (Requirement 4.3). Both the fill width and the visible percentage
 * are driven by the shared {@link useCounter} primitive, so the animation reuses
 * the same in-view + count-up machinery as the trust-section {@link Counter}.
 *
 * Reduced motion (Requirement 4.4 / Correctness Property 9): {@link useCounter}
 * returns the target immediately when the user prefers reduced motion, so the
 * bar renders its final width and final percentage instantly with no animation.
 *
 * Accessibility: the bar is a `role="progressbar"` exposing
 * `aria-valuenow`/`min`/`max` set to the true target proficiency (not the
 * mid-animation value), with an accessible name derived from the skill, so
 * assistive tech always announces the real skill level.
 */
export function ProficiencyBar({
  name,
  proficiency,
  className,
}: ProficiencyBarProps) {
  const target = clampProficiency(proficiency);
  const { ref, inView } = useInView<HTMLDivElement>({ once: true });
  const display = useCounter({ target, active: inView });

  return (
    <div ref={ref} className={cn("flex flex-col gap-space-1", className)}>
      <div className="flex items-baseline justify-between gap-space-2">
        <span className="font-sans text-body font-medium text-text">
          {name}
        </span>
        <span className="font-sans text-caption tabular-nums text-muted">
          {display}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${name} proficiency`}
        aria-valuenow={target}
        aria-valuemin={MIN_PROFICIENCY}
        aria-valuemax={MAX_PROFICIENCY}
        className="h-2 w-full overflow-hidden rounded-full border border-hairline bg-bg-secondary"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${display}%` }}
        />
      </div>
    </div>
  );
}
