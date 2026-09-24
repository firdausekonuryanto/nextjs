// Potongan kecil untuk form yang padat & seragam.
import type { ReactNode } from "react";

export const inputClass = (error?: string) =>
  `h-9 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
    error ? "border-red-400" : "border-slate-300"
  }`;

export function Field({
  label,
  required,
  error,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-0.5 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
