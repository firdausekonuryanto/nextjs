import type { ReactNode } from "react";

// Strip judul halaman di atas konten: Judul + badge total + ringkasan di kanan.
export function PageHeader({
  title,
  total,
  children,
}: {
  title: string;
  total?: string;
  children?: ReactNode;
}) {
  return (
    <div className="-mx-4 -mt-4 mb-4 md:-mt-5 flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-2.5 md:-mx-5 md:px-5">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold">{title}</h1>
        {total && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {total}
          </span>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}

// Chip ringkasan kecil, mis. "Total Stok: 589 unit"
export function StatChip({
  label,
  value,
  tone = "default",
}: {
  label?: string;
  value: ReactNode;
  tone?: "default" | "success" | "warning";
}) {
  const tones = {
    default: "border-slate-200 bg-white text-slate-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs ${tones[tone]}`}
    >
      {tone !== "default" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {label && <span>{label}:</span>}
      <span
        className={
          tone === "default" ? "font-semibold text-slate-900" : "font-medium"
        }
      >
        {value}
      </span>
    </span>
  );
}
