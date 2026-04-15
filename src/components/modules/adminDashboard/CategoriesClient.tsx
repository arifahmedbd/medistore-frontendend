"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Loader2, Tag, Package, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/category.action";

interface Category {
  id: string; name: string; createdAt: string;
  _count: { medicines: number };
}

// ── Modal ──────────────────────────────────────────────────
function CategoryModal({
  mode, category, onClose, onSuccess,
}: {
  mode: "add" | "edit";
  category?: Category;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName]           = useState(category?.name ?? "");
  const [isPending, startTransition] = useTransition();
  const backdropRef               = useRef<HTMLDivElement>(null);

  const submit = () => {
    if (!name.trim()) { toast.error("Category name is required"); return; }
    startTransition(async () => {
      const res = mode === "add"
        ? await createCategoryAction(name.trim())
        : await updateCategoryAction(category!.id, name.trim());
      if (res?.success) {
        toast.success(mode === "add" ? "Category created!" : "Category updated!");
        onSuccess();
      } else {
        toast.error(res?.message ?? "Something went wrong");
      }
    });
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white dark:bg-[#0e1525] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h2 className="font-bold text-slate-800 dark:text-white">
            {mode === "add" ? "New Category" : "Edit Category"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Category Name <span className="text-red-400">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="e.g. Pain Relief"
            autoFocus
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#0a1020] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-700/50">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            Cancel
          </button>
          <button onClick={submit} disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-[#0a0f1e] dark:bg-violet-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {mode === "add" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ──────────────────────────────────────────
function DeleteConfirm({ category, onClose, onSuccess }: {
  category: Category; onClose: () => void; onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const hasItems = category._count.medicines > 0;

  const confirm = () => startTransition(async () => {
    const res = await deleteCategoryAction(category.id);
    if (res?.success) { toast.success("Category deleted"); onSuccess(); }
    else toast.error(res?.message ?? "Failed to delete");
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0e1525] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {hasItems ? <AlertTriangle size={20} className="text-amber-500" /> : <Trash2 size={20} className="text-red-500" />}
        </div>
        <h3 className="font-bold text-center text-slate-800 dark:text-white mb-2">
          {hasItems ? "Cannot Delete" : "Delete Category"}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          {hasItems
            ? `"${category.name}" has ${category._count.medicines} medicine(s) assigned. Reassign or delete them first.`
            : `Are you sure you want to delete "${category.name}"? This cannot be undone.`}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            {hasItems ? "OK" : "Cancel"}
          </button>
          {!hasItems && (
            <button onClick={confirm} disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
              {isPending && <Loader2 size={13} className="animate-spin" />}
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────
export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const router                 = useRouter();
  const [modal, setModal]      = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected]= useState<Category | null>(null);

  const refresh = () => {
    setModal(null);
    setSelected(null);
    router.refresh();
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Categories</h1>
          <p className="text-sm text-slate-400 mt-1">{categories.length} categor{categories.length !== 1 ? "ies" : "y"}</p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="inline-flex items-center gap-2 bg-[#0a0f1e] dark:bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus size={15} /> New Category
        </button>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 py-20 text-center">
          <Tag size={32} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
          <p className="text-slate-400 font-medium">No categories yet</p>
          <button onClick={() => setModal("add")} className="mt-3 text-sm text-violet-500 hover:underline font-medium">
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 p-5 hover:shadow-md transition-shadow group"
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4">
                <Tag size={18} className="text-violet-600 dark:text-violet-400" />
              </div>

              {/* Name */}
              <h3 className="font-bold text-slate-800 dark:text-white mb-1 capitalize">{cat.name}</h3>

              {/* Medicine count */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                <Package size={12} />
                {cat._count.medicines} medicine{cat._count.medicines !== 1 ? "s" : ""}
              </div>

              {/* Created date */}
              <p className="text-[11px] text-slate-300 dark:text-slate-600 mb-4">
                Created {new Date(cat.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelected(cat); setModal("edit"); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => { setSelected(cat); setModal("delete"); }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {modal === "add" && (
        <CategoryModal mode="add" onClose={() => setModal(null)} onSuccess={refresh} />
      )}
      {modal === "edit" && selected && (
        <CategoryModal mode="edit" category={selected} onClose={() => { setModal(null); setSelected(null); }} onSuccess={refresh} />
      )}
      {modal === "delete" && selected && (
        <DeleteConfirm category={selected} onClose={() => { setModal(null); setSelected(null); }} onSuccess={refresh} />
      )}
    </>
  );
}