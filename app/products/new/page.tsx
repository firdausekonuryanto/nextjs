import ProductForm from "../product-form";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tambah Produk</h1>
      <ProductForm action={createProductAction} submitLabel="Simpan" />
    </div>
  );
}
