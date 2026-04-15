"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, Loader2, X, Package,
  AlertTriangle, ChevronLeft, ChevronRight, ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  createMedicineAction,
  updateMedicineAction,
  deleteMedicineAction,
} from "@/actions/seller.action";

interface Medicine {
  id: string; name: string; description: string; price: number;
  stock: number; manufacturer: string; image: string | null;
  category: { name: string }; categoryId: string;
}

interface Category { id: string; name: string; }

interface Props {
  medicines: Medicine[]; categories: Category[];
  totalPages: number; total: number;
  page: number; search: string; openAddModal?: boolean;
}

const EMPTY_FORM = {
  name: "", description: "", price: "", stock: "",
  manufacturer: "", image: "", categoryId: "",
};

type FormData = typeof EMPTY_FORM;

// ── Modal ──────────────────────────────────────────────────
function MedicineModal({
  mode, medicine, categories, onClose, onSuccess,
}: {
  mode: "add" | "edit";
  medicine?: Medicine;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    name:         medicine?.name         ?? "",
    description:  medicine?.description  ?? "",
    price:        medicine?.price?.toString() ?? "",
    stock:        medicine?.stock?.toString() ?? "",
    manufacturer: medicine?.manufacturer ?? "",
    image:        medicine?.image         ?? "",
    categoryId:   medicine?.categoryId   ?? "",
  });
  const [isPending, startTransition] = useTransition();

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }
    startTransition(async () => {
      const payload = {
        name: form.name, description: form.description,
        price: parseFloat(form.price), stock: parseInt(form.stock, 10),
        manufacturer: form.manufacturer, image: form.image || undefined,
        categoryId: form.categoryId,
      };
      const res = mode === "add"
        ? await createMedicineAction(payload)
        : await updateMedicineAction(medicine!.id, payload);

      if (res?.success) {
        toast.success(mode === "add" ? "Medicine added!" : "Medicine updated!");
        onSuccess();
      } else {
        toast.error(res?.message ?? "Something went wrong");
      }
    });
  };

  // Close on backdrop
  const backdropRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white dark:bg-[#0e1c30] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
          <h2 className="font-bold text-slate-800 dark:text-white">
            {mode === "add" ? "Add New Medicine" : "Edit Medicine"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Medicine Name <span className="text-red-400">*</span>
              </label>
              <input value={form.name} onChange={set("name")} placeholder="e.g. Ibuprofen 200mg"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Price (£) <span className="text-red-400">*</span>
              </label>
              <input value={form.price} onChange={set("price")} type="number" min="0" step="0.01" placeholder="0.00"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Stock <span className="text-red-400">*</span>
              </label>
              <input value={form.stock} onChange={set("stock")} type="number" min="0" placeholder="0"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select value={form.categoryId} onChange={set("categoryId")}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Manufacturer</label>
              <input value={form.manufacturer} onChange={set("manufacturer")} placeholder="e.g. Pfizer"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Image URL</label>
              <input value={form.image} onChange={set("image")} placeholder="https://..."
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Description</label>
              <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Brief description..."
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-[#0a1628] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a] resize-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-700/50">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            Cancel
          </button>
          <button onClick={submit} disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-[#0b1f3a] dark:bg-[#2ecc8a] text-white dark:text-[#0b1f3a] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {mode === "add" ? "Add Medicine" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ──────────────────────────────────────────
function DeleteConfirm({ medicine, onClose, onSuccess }: { medicine: Medicine; onClose: () => void; onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition();

  const confirm = () => startTransition(async () => {
    const res = await deleteMedicineAction(medicine.id);
    if (res?.success) { toast.success("Medicine deleted"); onSuccess(); }
    else toast.error(res?.message ?? "Failed to delete");
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0e1c30] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="font-bold text-center text-slate-800 dark:text-white mb-2">Delete Medicine</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Are you sure you want to delete <strong>&quot;{medicine.name}&quot;</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
          <button onClick={confirm} disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main client component ───────────────────────────────────
export default function InventoryClient({ medicines, categories, totalPages, total, page, search, openAddModal }: Props) {
  const router = useRouter();
  const [modal, setModal]       = useState<"add" | "edit" | "delete" | null>(openAddModal ? "add" : null);
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [searchVal, setSearchVal] = useState(search);

  const refresh = () => {
    setModal(null);
    setSelected(null);
    router.refresh();
  };

  const buildHref = (p: number, s = search) => {
    const q = new URLSearchParams();
    if (s) q.set("search", s);
    if (p > 1) q.set("page", String(p));
    return `/seller/dashboard/medicines?${q.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildHref(1, searchVal));
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">{total} medicine{total !== 1 ? "s" : ""} listed</p>
        </div>
        <button
  onClick={() => setModal("add")}
  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
             bg-slate-900 text-white 
             dark:bg-green-500 dark:text-slate-900
             hover:opacity-90 transition"
>
  <Plus size={16} /> Add Medicine
</button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search your medicines..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-[#0e1c30] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2ecc8a]"
          />
        </div>
        <button
  type="submit"
  className="px-4 py-2.5 rounded-xl text-sm font-medium
             bg-slate-900 text-white
             dark:bg-white dark:text-slate-900
             hover:opacity-90 transition"
>
  Search
</button>
        {search && (
          <Link href="/seller/dashboard/medicines" className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white dark:bg-[#0e1c30] rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden mb-6">
        {medicines.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={36} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No medicines found</p>
            <button onClick={() => setModal("add")} className="mt-3 text-sm text-[#27ae72] hover:underline font-medium">
              Add your first medicine
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0a1628] text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700/50">
                  <th className="text-left px-6 py-3">Medicine</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">Stock</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1628] transition align-middle">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 flex items-center justify-center">
                          {med.image
                            ? <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
                            : <ImageOff size={14} className="text-slate-400" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-white">{med.name}</p>
                          {med.manufacturer && (
                            <p className="text-xs text-slate-400">{med.manufacturer}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                        {med.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-800 dark:text-white">
                      £{med.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        med.stock === 0
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : med.stock <= 10
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {med.stock <= 10 && med.stock > 0 && <AlertTriangle size={10} />}
                        {med.stock === 0 ? "Out of stock" : `${med.stock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelected(med); setModal("edit"); }}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => { setSelected(med); setModal("delete"); }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {page > 1 && (
            <Link href={buildHref(page - 1)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ChevronLeft size={16} />
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildHref(p)} className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
              p === page
                ? "bg-[#0b1f3a] dark:bg-[#2ecc8a] text-white dark:text-[#0b1f3a]"
                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}>{p}</Link>
          ))}
          {page < totalPages && (
            <Link href={buildHref(page + 1)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}

      {/* Modals */}
      {modal === "add" && (
        <MedicineModal mode="add" categories={categories} onClose={() => setModal(null)} onSuccess={refresh} />
      )}
      {modal === "edit" && selected && (
        <MedicineModal mode="edit" medicine={selected} categories={categories} onClose={() => { setModal(null); setSelected(null); }} onSuccess={refresh} />
      )}
      {modal === "delete" && selected && (
        <DeleteConfirm medicine={selected} onClose={() => { setModal(null); setSelected(null); }} onSuccess={refresh} />
      )}
    </>
  );
}