import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "../../actions";
import ProductForm from "../../product-form";

export default async function EditProductPage({
  params,
}: PageProps<"/products/[id]/edit">) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) notFound(); // = findOrFail()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Produk</h1>
      <ProductForm
        action={updateProductAction.bind(null, product.id)}
        product={product}
        submitLabel="Update"
      />
    </div>
  );
}
