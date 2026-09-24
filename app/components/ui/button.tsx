import Link from "next/link";
import type { ComponentProps } from "react";

// Pilihan warna — seperti @props(['variant' => 'primary']) di Blade
const variants = {
  // primary: "bg-blue-600 text-white hover:bg-blue-700",
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-600 hover:bg-slate-100",
};

// Pilihan ukuran
const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-5 py-3 text-lg",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

function classes(variant: Variant, size: Size, extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition
    disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`;
}

// <Button> — tombol biasa (submit, onClick, dll)
type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props // atribut <button> lainnya: type, onClick, name, dll
}: ButtonProps) {
  return (
    <button
      className={classes(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

// <ButtonLink> — link yang tampil seperti tombol (untuk pindah halaman)
type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={classes(variant, size, className)} {...props} />;
}
