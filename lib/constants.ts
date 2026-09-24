// Konstanta yang aman dipakai di server MAUPUN browser (tidak import database).
export const CATEGORIES = [
  "Elektronik",
  "Jaringan",
  "Aksesoris",
  "Lainnya",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const LOW_STOCK = 10; // batas stok menipis

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
