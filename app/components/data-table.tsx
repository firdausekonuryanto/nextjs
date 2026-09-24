"use client";

// DataTable serbaguna (mirip DataTables jQuery) berbasis TanStack Table v9.
// Fitur: urutkan kolom, cari, pilih baris (checkbox), pagination, jumlah baris, export CSV, print.
import { useState, type ReactNode } from "react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { Icon } from "@/app/components/ui/icons";

// meta per kolom: align kanan/tengah, ikut di-export CSV atau tidak
type ColumnMeta = { align?: "left" | "right" | "center"; csv?: false };

// Fitur didefinisikan sekali di luar komponen (harus stabil)
export const dataTableFeatures = tableFeatures({
  columnMeta: metaHelper<ColumnMeta>(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

type F = typeof dataTableFeatures;

// Helper untuk membuat kolom: const col = columnHelper<Product>()
export const columnHelper = <T extends RowData>() => createColumnHelper<F, T>();

type Props<T extends RowData> = {
  title: string;
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<F, T, any>[];
  getRowId: (row: T) => string;
  itemLabel?: string; // "produk", "user"
  searchPlaceholder?: string;
  toolbar?: ReactNode; // filter tambahan (mis. dropdown kategori)
  highlightRowId?: string; // baris yang sedang diedit
  exportFileName?: string;
};

const pageSizes = [5, 10, 25, 50];

export default function DataTable<T extends RowData>({
  title,
  data,
  columns,
  getRowId,
  itemLabel = "data",
  searchPlaceholder = "Cari...",
  toolbar,
  highlightRowId,
  exportFileName = "data",
}: Props<T>) {
  const [search, setSearch] = useState("");

  // Kolom checkbox ditambahkan otomatis di depan
  const selectColumn: ColumnDef<F, T, unknown> = {
    id: "_select",
    enableSorting: false,
    enableGlobalFilter: false,
    meta: { csv: false },
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Pilih semua"
        className="h-3.5 w-3.5 rounded accent-blue-600"
        checked={table.getIsAllPageRowsSelected()}
        ref={(el) => {
          if (el) el.indeterminate = table.getIsSomePageRowsSelected();
        }}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label="Pilih baris"
        className="h-3.5 w-3.5 rounded accent-blue-600"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  };

  const [allColumns] = useState(() => [selectColumn, ...columns]);

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: allColumns,
    getRowId,
    globalFilterFn: "includesString",
    sortDescFirst: false, // klik pertama = urut naik (A-Z, kecil-besar) seperti DataTables
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const selectedCount = table.getSelectedRowModel().rows.length;
  const from = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, filteredCount);
  const pageCount = table.getPageCount();

  const doSearch = (value: string) => {
    setSearch(value);
    table.setGlobalFilter(value);
    table.setPageIndex(0);
  };

  // Export CSV: baris terpilih, atau semua hasil filter kalau tidak ada yang dipilih
  const exportCsv = () => {
    const cols = table
      .getAllLeafColumns()
      .filter(
        (c) =>
          c.columnDef.meta?.csv !== false && "accessorFn" in c && c.accessorFn,
      );
    const rows =
      selectedCount > 0
        ? table.getSelectedRowModel().rows
        : table.getFilteredRowModel().rows;
    const esc = (v: unknown) =>
      `"${String(v instanceof Date ? v.toISOString().slice(0, 10) : (v ?? "")).replace(/"/g, '""')}"`;
    const header = cols.map((c) =>
      esc(typeof c.columnDef.header === "string" ? c.columnDef.header : c.id),
    );
    const lines = rows.map((r) =>
      cols.map((c) => esc(r.getValue(c.id))).join(","),
    );
    const blob = new Blob(
      ["\uFEFF" + [header.join(","), ...lines].join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${exportFileName}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Print: tampilkan semua baris dulu, lalu cetak
  const print = () => {
    const prev = pageSize;
    table.setPageSize(Math.max(filteredCount, 1));
    setTimeout(() => {
      window.print();
      table.setPageSize(prev);
    }, 100);
  };

  // Nomor halaman (maks 5 tombol)
  const start = Math.max(0, Math.min(pageIndex - 2, pageCount - 5));
  const pages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, i) => start + i,
  );

  const alignClass = (a?: string) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";
  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50";

  return (
    <div className="rounded-lg border bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 print:hidden">
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-1">
          <h2 className="whitespace-nowrap text-sm font-semibold">
            {title}{" "}
            <span className="font-normal text-slate-400">
              ({filteredCount})
            </span>
          </h2>
          <div className="relative min-w-40 flex-1 sm:w-64 sm:flex-none">
            <Icon.Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => doSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-md border border-slate-300 pl-8 pr-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {selectedCount > 0 && (
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
              {selectedCount} dipilih ·{" "}
              <button
                className="underline"
                onClick={() => table.resetRowSelection(true)}
              >
                batal
              </button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {toolbar}
          <button
            onClick={exportCsv}
            className={iconBtn}
            title={selectedCount ? "Export baris terpilih (CSV)" : "Export CSV"}
            aria-label="Export CSV"
          >
            <Icon.Download />
          </button>
          <button
            onClick={print}
            className={iconBtn}
            title="Print"
            aria-label="Print"
          >
            <Icon.Printer />
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sorted = header.column.getIsSorted();
                  const printHide =
                    header.column.id === "_select" ||
                    header.column.id === "actions"
                      ? "print:hidden"
                      : "";
                  return (
                    <th
                      key={header.id}
                      className={`whitespace-nowrap px-3 py-2 font-semibold ${alignClass(meta?.align)} ${header.column.id === "_select" ? "w-8" : ""} ${printHide}`}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={`inline-flex items-center gap-1 uppercase hover:text-slate-900 ${meta?.align === "right" ? "flex-row-reverse" : ""}`}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" ? (
                            <Icon.ChevronUp className="h-3 w-3 text-blue-600" />
                          ) : sorted === "desc" ? (
                            <Icon.ChevronDown className="h-3 w-3 text-blue-600" />
                          ) : (
                            <Icon.Sort className="h-3 w-3 opacity-40 print:hidden" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b last:border-0 ${row.id === highlightRowId ? "bg-blue-50" : row.getIsSelected() ? "bg-slate-50" : "hover:bg-slate-50"}`}
              >
                {row.getAllCells().map((cell) => {
                  const id = cell.column.id;
                  return (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap px-3 py-2 ${alignClass(cell.column.columnDef.meta?.align)} ${id === "_select" || id === "actions" ? "print:hidden" : ""}`}
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredCount === 0 && (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="px-3 py-10 text-center text-slate-500"
                >
                  {search
                    ? `Tidak ada ${itemLabel} yang cocok dengan "${search}".`
                    : `Belum ada ${itemLabel}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: info + jumlah baris + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-3 py-2 text-xs text-slate-600 print:hidden">
        <div className="flex items-center gap-3">
          <span>
            Menampilkan{" "}
            <b>
              {from}-{to}
            </b>{" "}
            dari <b>{filteredCount}</b> {itemLabel}
          </span>
          <span className="h-4 border-l" />
          <label className="flex items-center gap-1.5">
            Baris:
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-7 rounded-md border border-slate-300 bg-white px-1.5"
            >
              {pageSizes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 rounded-md border border-slate-300 px-2.5 hover:bg-slate-50 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => table.setPageIndex(p)}
              className={`h-7 min-w-7 rounded-md px-2 font-medium ${p === pageIndex ? "bg-blue-600 text-white" : "border border-slate-300 hover:bg-slate-50"}`}
            >
              {p + 1}
            </button>
          ))}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-7 rounded-md border border-slate-300 px-2.5 hover:bg-slate-50 disabled:opacity-40"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
