import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { getProduct, getProducts } from "@/lib/products";
import { requireUser } from "@/lib/dal";
import DeleteButton from "./delete-button";
import ProductForm from "./product-form";

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
  await requireUser();
  const {
    q = "",
    msg,
    edit,
  } = (await searchParams) as { q?: string; msg?: string; edit?: string };

  const products = await getProducts(q);
  const editing = edit ? await getProduct(Number(edit)) : undefined; // ?edit=5 → mode edit

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Produk</h1>

      {msg && messages[msg] && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          {messages[msg]}
        </div>
      )}

      {/* FORM di atas. key baru tiap render server → form bersih lagi setelah simpan */}
      <ProductForm
        key={editing ? `edit-${editing.id}` : `new-${crypto.randomUUID()}`}
        product={editing}
      />

      {/* LIST di bawah */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <h2 className="font-semibold">
            Daftar Produk{" "}
            <span className="font-normal text-slate-400">
              ({products.length})
            </span>
          </h2>
          <form className="flex w-full gap-2 sm:w-auto">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk..."
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm sm:w-64"
            />
            <Button variant="secondary" size="sm">
              Cari
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Nama</th>
                <th className="px-4 py-2.5 text-right">Harga</th>
                <th className="px-4 py-2.5 text-right">Stok</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t ${editing?.id === p.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                >
                  <td className="px-4 py-2.5 text-slate-500">{p.id}</td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-right">{rupiah(p.price)}</td>
                  <td
                    className={`px-4 py-2.5 text-right ${p.stock <= 10 ? "font-semibold text-amber-600" : ""}`}
                  >
                    {p.stock}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/products?edit=${p.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
    </div>
  );
}
