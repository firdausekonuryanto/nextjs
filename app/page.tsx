import Link from "next/link";
import { PageHeader, StatChip } from "@/app/components/page-header";
import Flash from "@/app/components/flash";
import { requireUser } from "@/lib/dal";
import { getProducts } from "@/lib/products";
import { getUsers } from "@/lib/users";
import { LOW_STOCK, rupiah } from "@/lib/constants";

export default async function Dashboard({ searchParams }: PageProps<"/">) {
  const user = await requireUser();
  const { msg } = (await searchParams) as { msg?: string };
  const products = await getProducts();
  const lowStock = products
    .filter((p) => p.stock <= LOW_STOCK)
    .sort((a, b) => a.stock - b.stock);

  const cards = [
    {
      label: "Total Produk",
      value: products.length.toString(),
      href: "/products",
    },
    {
      label: "Total Stok",
      value: `${products.reduce((s, p) => s + p.stock, 0).toLocaleString("id-ID")} unit`,
      href: "/products",
    },
    {
      label: "Nilai Aset",
      value: rupiah(products.reduce((s, p) => s + p.price * p.stock, 0)),
      href: "/products",
    },
    ...(user.role === "admin"
      ? [
          {
            label: "Total Users",
            value: (await getUsers()).length.toString(),
            href: "/users",
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader title="Dashboard">
        <StatChip value={`Halo, ${user.name} 👋`} />
      </PageHeader>

      <Flash
        tone="error"
        message={
          msg === "forbidden"
            ? "Anda tidak punya akses ke halaman tersebut (khusus admin)."
            : undefined
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border bg-white px-4 py-3 transition hover:border-blue-300"
          >
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="mt-0.5 text-xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h2 className="text-sm font-semibold">
            Stok Menipis{" "}
            <span className="font-normal text-slate-400">
              ({lowStock.length})
            </span>
          </h2>
          <Link
            href="/products"
            className="text-xs text-blue-600 hover:underline"
          >
            Lihat semua produk
          </Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {lowStock.map((p) => (
              <tr
                key={p.id}
                className="border-b last:border-0 hover:bg-slate-50"
              >
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-slate-500">{p.category}</td>
                <td
                  className={`px-3 py-2 text-right font-semibold ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}
                >
                  {p.stock === 0 ? "Habis" : `Sisa ${p.stock}`}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/products?edit=${p.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Tambah stok
                  </Link>
                </td>
              </tr>
            ))}
            {lowStock.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500">
                  Semua stok aman 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
