import { PageHeader, StatChip } from "@/app/components/page-header";
import Flash from "@/app/components/flash";
import { getProduct, getProducts } from "@/lib/products";
import { LOW_STOCK, rupiah } from "@/lib/constants";
import { requireUser } from "@/lib/dal";
import ProductForm from "./product-form";
import ProductsTable from "./products-table";

const messages: Record<string, string> = {
  created: "Produk berhasil ditambahkan.",
  updated: "Produk berhasil diperbarui.",
  deleted: "Produk berhasil dihapus.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  await requireUser();
  const { msg, edit } = (await searchParams) as { msg?: string; edit?: string };

  const products = await getProducts();
  const editing = edit ? await getProduct(Number(edit)) : undefined;

  // Ringkasan
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const assetValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowCount = products.filter((p) => p.stock <= LOW_STOCK).length;

  return (
    <>
      <PageHeader
        title="Katalog Produk"
        total={`Total: ${products.length} Item`}
      >
        <StatChip
          label="Total Stok"
          value={`${totalStock.toLocaleString("id-ID")} unit`}
        />
        <StatChip label="Nilai Aset" value={rupiah(assetValue)} />
        {lowCount > 0 ? (
          <StatChip tone="warning" value={`${lowCount} stok menipis`} />
        ) : (
          <StatChip tone="success" value="Semua Stok Tersedia" />
        )}
      </PageHeader>

      <Flash message={msg ? messages[msg] : undefined} />

      <ProductForm
        key={editing ? `edit-${editing.id}` : `new-${crypto.randomUUID()}`}
        product={editing}
      />
      <ProductsTable products={products} editingId={editing?.id} />
    </>
  );
}
