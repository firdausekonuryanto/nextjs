"use client";

import { useActionState } from "react";
import { Button, ButtonLink } from "@/app/components/ui/button";
import { Field, inputClass } from "@/app/components/ui/form";
import { Icon } from "@/app/components/ui/icons";
import { CATEGORIES } from "@/lib/constants";
import {
  createProductAction,
  updateProductAction,
  type FormState,
} from "./actions";
import type { Product } from "@/lib/products";

// Satu form untuk Tambah & Edit. Kalau `product` ada → mode edit.
export default function ProductForm({ product }: { product?: Product }) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const v = state.values ?? {
    name: product?.name ?? "",
    category: product?.category ?? CATEGORIES[0],
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
  };
  const e = state.errors ?? {};

  return (
    <form
      action={formAction}
      className={`mb-4 rounded-lg border bg-white px-4 py-3 print:hidden ${product ? "border-blue-300 ring-2 ring-blue-100" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span
            className={`h-2 w-2 rounded-full ${product ? "bg-blue-500" : "bg-emerald-500"}`}
          />
          {product ? (
            <>
              Edit Produk <span className="text-slate-400">#{product.id}</span>
            </>
          ) : (
            "Tambah Produk Baru"
          )}
        </h2>
        <span className="hidden text-xs text-slate-400 sm:block">
          Form input cepat inventaris
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
        <Field
          className="sm:col-span-2 lg:col-span-4"
          label="Nama Produk"
          required
          error={e.name}
        >
          <input
            key={v.name}
            name="name"
            defaultValue={v.name}
            placeholder="Contoh: Router MikroTik"
            className={inputClass(e.name)}
          />
        </Field>

        <Field className="lg:col-span-2" label="Kategori" error={e.category}>
          <select
            key={v.category}
            name="category"
            defaultValue={v.category}
            className={inputClass(e.category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field
          className="lg:col-span-2"
          label="Harga (Rp)"
          required
          error={e.price}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              Rp
            </span>
            <input
              key={v.price}
              name="price"
              type="number"
              min={0}
              defaultValue={v.price}
              placeholder="0"
              className={`${inputClass(e.price)} pl-9`}
            />
          </div>
        </Field>

        <Field
          className="lg:col-span-2"
          label={product ? "Stok" : "Stok Awal"}
          required
          error={e.stock}
        >
          <input
            key={v.stock}
            name="stock"
            type="number"
            min={0}
            defaultValue={v.stock}
            placeholder="0"
            className={inputClass(e.stock)}
          />
        </Field>

        <div className="flex gap-2 sm:col-span-2 lg:col-span-2 lg:pt-5">
          <Button
            type="submit"
            loading={pending}
            size="sm"
            className="h-9 flex-1"
          >
            {!pending && (product ? <Icon.Pencil /> : <Icon.Plus />)}
            {product ? "Update" : "Simpan"}
          </Button>
          {product && (
            <ButtonLink
              href="/products"
              variant="secondary"
              size="sm"
              className="h-9"
            >
              Batal
            </ButtonLink>
          )}
        </div>
      </div>
    </form>
  );
}
