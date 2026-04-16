import Link from "next/link";

import { ShoppingBag, Search, SlidersHorizontal } from "lucide-react";
import { Medicine } from "@/services/medicine.service";
import { getMedicinesAction } from "@/actions/medicine.action";
import { getCategoriesAction } from "@/actions/category.action";

interface ShopPageProps {
  searchParams?: Promise<{ category?: string; search?: string; page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const categoryId = resolvedParams?.category ?? "";
  const searchQuery = resolvedParams?.search ?? "";
  const page = parseInt(resolvedParams?.page ?? "1", 10) || 1;
  const limit = 12;

  let categories: { id: string; name: string }[] = [];
  let medicines: Medicine[] = [];
  let totalPages = 1;

  try {
    const [categoriesRes, medicineRes] = await Promise.all([
      getCategoriesAction(),
      getMedicinesAction({ categoryId, search: searchQuery, page, limit }),
    ]);
    categories = categoriesRes ?? [];
    medicines = medicineRes?.data.medicines?? [];
    totalPages = medicineRes?.data?.pagination?.totalPages ?? 1;
  } catch (err) {
    console.error("Failed to load shop data:", err);
  }
  console.log(medicines, "med")

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (searchQuery) params.set("search", searchQuery);
    params.set("page", String(p));
    return `/shop?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
      <div className="container mx-auto px-4 py-12 max-w-7xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Shop Medicines
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Browse our full range of medicines & health products
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <form className="flex flex-col sm:flex-row gap-3 mb-8 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search medicine..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              name="category"
              defaultValue={categoryId}
              className="pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer transition min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hidden page reset — go to page 1 on new filter */}
          <input type="hidden" name="page" value="1" />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Filter
          </button>

          {(categoryId || searchQuery) && (
            <Link
              href="/shop"
              className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition whitespace-nowrap"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Active filters pill */}
        {(categoryId || searchQuery) && (
          <div className="flex gap-2 flex-wrap mb-6">
            {searchQuery && (
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {categoryId && (
              <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                Category: {categories.find((c) => c.id === categoryId)?.name ?? categoryId}
              </span>
            )}
          </div>
        )}

        {/* Grid or Empty State */}
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              No medicines found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs">
              Try adjusting your search or category filter to find what you&apos;re looking for.
            </p>
            <Link
              href="/shop"
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Showing {medicines.length} result{medicines.length !== 1 ? "s" : ""}
              {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {medicines.map((med) => (
                <Link key={med.id} href={`/shop/${med.id}`} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    {/* Image */}
                    <div className="relative h-44 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      {med.image ? (
                        <img
                          src={med.image}
                          alt={med.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                      {med.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {med.stock > 0 && med.stock <= 10 && (
                        <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3.5">
                      <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                        {med.category?.name ?? "Medicine"}
                      </p>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2">
                        {med.name}
                      </h3>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        £{med.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-1.5 flex-wrap">
            {page > 1 && (
              <Link
                href={buildHref(page - 1)}
                className="px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                ← Prev
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === page;
              const isNear = Math.abs(p - page) <= 2 || p === 1 || p === totalPages;
              if (!isNear) {
                if (p === 2 || p === totalPages - 1) {
                  return <span key={p} className="px-1 text-gray-400">…</span>;
                }
                return null;
              }
              return (
                <Link
                  key={p}
                  href={buildHref(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {p}
                </Link>
              );
            })}

            {page < totalPages && (
              <Link
                href={buildHref(page + 1)}
                className="px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}