// Pesan sukses/gagal kecil di atas form
export default function Flash({
  message,
  tone = "success",
}: {
  message?: string;
  tone?: "success" | "error";
}) {
  if (!message) return null;
  const cls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";
  return (
    <div
      className={`mb-3 rounded-md border px-3 py-2 text-sm print:hidden ${cls}`}
    >
      {message}
    </div>
  );
}
