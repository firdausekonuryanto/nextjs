"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable, { columnHelper } from "@/app/components/data-table";
import { Icon } from "@/app/components/ui/icons";
import { CATEGORIES, LOW_STOCK, rupiah } from "@/lib/constants";
import type { Product } from "@/lib/products";
import DeleteButton from "./delete-button";

// Warna avatar huruf per kategori
const catColor: Record<string, string> = {
  Elektronik: "bg-violet-50 text-violet-700 border-violet-200",
  Jaringan: "bg-sky-50 text-sky-700 border-sky-200",
  Aksesoris: "bg-amber-50 text-amber-700 border-amber-200",
  Lainnya: "bg-slate-50 text-slate-700 border-slate-200",
};

const status = (stock: number) =>
  stock === 0
    ? {
        label: "Habis",
        dot: "bg-red-500",
        text: "text-red-600",
        pill: "border-red-200 bg-red-50 text-red-700",
      }
    : stock <= LOW_STOCK
      ? {
          label: "Menipis",
          dot: "bg-amber-500",
          text: "text-amber-600",
          pill: "border-amber-200 bg-amber-50 text-amber-700",
        }
      : {
          label: "Aktif",
          dot: "bg-emerald-500",
          text: "text-emerald-600",
          pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
        };

// Definisi kolom (dibuat sekali, di luar komponen)
const col = columnHelper<Product>();
const columns = col.columns([
  col.accessor("id", {
    header: "#",
    cell: (c) => <span className="text-slate-400">{c.getValue()}</span>,
  }),
  col.accessor("name", {
    header: "Nama Produk",
    cell: ({ row }) => (
      <span className="flex items-center gap-2 font-medium">
        <span
          className={`grid h-6 w-6 place-items-center rounded border text-xs font-semibold ${catColor[row.original.category]}`}
        >
          {row.original.name.charAt(0).toUpperCase()}
        </span>
        {row.original.name}
      </span>
    ),
  }),
  col.accessor("category", {
    header: "Kategori",
    cell: (c) => (
      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
        {c.getValue()}
      </span>
    ),
  }),
  col.accessor("price", {
    header: "Harga",
    meta: { align: "right" },
    cell: (c) => rupiah(c.getValue()),
  }),
  col.accessor("stock", {
    header: "Stok",
    meta: { align: "center" },
    cell: (c) => (
      <span
        className={`inline-block min-w-9 rounded-full border px-2 py-0.5 text-xs font-medium ${status(c.getValue()).pill}`}
      >
        {c.getValue()}
      </span>
    ),
  }),
  col.display({
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => {
      const s = status(row.original.stock);
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
        </span>
      );
    },
  }),
  col.display({
    id: "actions",
    header: "Aksi",
    meta: { align: "center" },
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 text-xs">
        <Link
          href={`/products?edit=${row.original.id}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <Icon.Pencil className="h-3.5 w-3.5" /> Edit
        </Link>
        <span className="text-slate-300">|</span>
        <DeleteButton id={row.original.id} name={row.original.name} />
      </span>
    ),
  }),
]);

export default function ProductsTable({
  products,
  editingId,
}: {
  products: Product[];
  editingId?: number;
}) {
  const [category, setCategory] = useState("");
  const data = useMemo(
    () =>
      category ? products.filter((p) => p.category === category) : products,
    [products, category],
  );

  return (
    <DataTable
      title="Daftar Produk"
      data={data}
      columns={columns}
      getRowId={(p) => String(p.id)}
      itemLabel="produk"
      searchPlaceholder="Cari nama produk..."
      highlightRowId={editingId ? String(editingId) : undefined}
      exportFileName="produk"
      toolbar={
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      }
    />
  );
}
