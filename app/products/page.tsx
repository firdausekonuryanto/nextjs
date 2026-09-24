import Link from "next/link";
import { getProducts } from "@/lib/products";
import DeleteButton from "./delete-button";
import { Button, ButtonLink } from "@/app/components/ui/button";

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const messages: Record<string, string> = {
  created: "Produk berhasil ditambahkan.",
  updated: "Produk berhasil diperbarui.",
  deleted: "Produk berhasil dihapus.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { q = "", msg } = (await searchParams) as { q?: string; msg?: string };
  const products = await getProducts(q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Daftar Produk</h1>
        <ButtonLink href="/products/new">+ Tambah Produk</ButtonLink>
      </div>

      {msg && messages[msg] && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          {messages[msg]}
        </div>
      )}

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama produk..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2"
        />
        <button className="rounded-lg border bg-white px-4 py-2 hover:bg-slate-100">
          Cari
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3 text-right">Harga</th>
              <th className="px-4 py-3 text-right">Stok</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 text-slate-500">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-right">{rupiah(p.price)}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  {q
                    ? `Tidak ada produk dengan kata "${q}".`
                    : "Belum ada produk."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
