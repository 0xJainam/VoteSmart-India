"use client";

// =============================================================================
// components/Icons.tsx — Pure inline SVG icons (zero external dependencies)
// =============================================================================
// Each icon accepts standard SVG props and defaults to aria-hidden="true"
// since they are decorative. Screen readers skip these; labels are on parents.
// =============================================================================

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function mergeProps(props: IconProps): IconProps {
  return { ...defaults, ...props };
}

/** Clipboard icon — used for Registration step */
export function Clipboard(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

/** Search icon — used for Research step */
export function Search(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/** Vote icon (ballot box) — used for Polling step */
export function Vote(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <path d="M2 18h20v4H2z" />
      <path d="M9 2l3 7h-2l3 7H7l3-7H8z" />
    </svg>
  );
}

/** BarChart icon — used for Counting step */
export function BarChart(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

/** Send icon — used in chat input */
export function Send(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/** Globe icon — used for language toggle */
export function Globe(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/** Check icon — used for checklist items */
export function Check(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Close / X icon — used for closing panels */
export function X(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Chat bubble icon — used for chat FAB */
export function MessageCircle(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Chevron Right — used for step transitions */
export function ChevronRight(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/** Loader spinner icon */
export function Loader(props: IconProps) {
  const p = mergeProps(props);
  return (
    <svg {...p} className={`animate-spin ${props.className ?? ""}`}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/** Map of icon names to components (used by Timeline to resolve step icons) */
export const ICON_MAP: Record<string, React.FC<IconProps>> = {
  clipboard: Clipboard,
  search: Search,
  vote: Vote,
  "bar-chart": BarChart,
};
