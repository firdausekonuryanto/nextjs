// Kumpulan ikon SVG kecil. Pakai: <Icon.Plus className="h-4 w-4" />
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (d: string) =>
  function SvgIcon({ className = "h-4 w-4", ...props }: P) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 ${className}`}
        aria-hidden
        {...props}
      >
        <path d={d} />
      </svg>
    );
  };

export const Icon = {
  Home: base("M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10"),
  Box: base(
    "M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 10L4 17V7m8 14V11M4 7l8 4",
  ),
  Users: base(
    "M17 20h5v-2a4 4 0 00-5-3.9M9 20H2v-2a4 4 0 014-4h2a4 4 0 014 4v2zm3-12a3 3 0 11-6 0 3 3 0 016 0zm7 1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  ),
  Plus: base("M12 5v14M5 12h14"),
  Pencil: base("M4 20h4L18.5 9.5a2.1 2.1 0 00-4-4L4 16v4zM13.5 6.5l4 4"),
  Trash: base(
    "M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3",
  ),
  Search: base("M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z"),
  Download: base("M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"),
  Printer: base(
    "M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2M6 14h12v7H6z",
  ),
  Bell: base(
    "M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  ),
  Logout: base(
    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  ),
  Menu: base("M4 6h16M4 12h16M4 18h16"),
  ChevronRight: base("M9 6l6 6-6 6"),
  ChevronUp: base("M6 15l6-6 6 6"),
  ChevronDown: base("M6 9l6 6 6-6"),
  Sort: base("M8 9l4-4 4 4M16 15l-4 4-4-4"),
};
