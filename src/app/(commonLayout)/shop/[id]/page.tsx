import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  Store,
  Star,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { getMedicineByIdAction } from "@/actions/medicine.action";

interface MedicineDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicineDetailPage({ params }: MedicineDetailPageProps) {
  const { id } = await params;

  let medicine: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    image: string | null;
    createdAt: string;
    category: { id: string; name: string };
    seller: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    reviews: { id: string; rating: number; comment?: string; user?: { name: string } }[];
  } | null = null;

  try {
    const res = await getMedicineByIdAction(id);
    medicine = res.data.data;

  } catch (err) {
    console.error("Failed to fetch medicine:", err);
  }
  if (!medicine) return notFound();

  const inStock = medicine.stock > 0;
  const lowStock = medicine.stock > 0 && medicine.stock <= 10;
  const avgRating =
    (medicine.reviews?.length ?? 0) > 0
      ? medicine.reviews!.reduce((sum, r) => sum + r.rating, 0) / medicine.reviews!.length
      : null;

  const addedDate = new Date(medicine.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
      <div className="container mx-auto px-4 py-10 max-w-6xl">

        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* ── Left: Image ── */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package size={64} className="text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>

            {/* Stock badge on image */}
            {!inStock && (
              <div className="absolute inset-0 rounded-3xl bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold px-5 py-2 rounded-full text-sm">
                  Out of Stock
                </span>
              </div>
            )}
            {lowStock && (
              <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle size={12} /> Only {medicine.stock} left
              </span>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-5">
            {/* Name & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {medicine.name}
              </h1>
              {avgRating !== null ? (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    {avgRating.toFixed(1)} ({medicine.reviews.length} review
                    {medicine.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No reviews yet</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                £{medicine?.price?.toFixed(2)} 
              
              </span>
              <span
                className={`mb-1 text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                  inStock
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
              >
                {inStock ? `${medicine.stock} in stock` : "Out of stock"}
              </span>
            </div>
           

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
              {medicine.description}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">
                  Manufacturer
                </p>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {medicine.manufacturer}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">
                  Added
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{addedDate}</p>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 overflow-hidden">
                {medicine?.seller?.image ? (
                  <img
                    src={medicine?.seller?.image}
                    alt={medicine?.seller?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store size={18} className="text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                  Sold by
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {medicine?.seller?.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {medicine?.seller?.email}
                </p>
              </div>
              <CheckCircle size={16} className="text-green-500 shrink-0" />
            </div>

            {/* CTA */}
            {/* <AddToCartButton
              medicineId={medicine.id}
              medicineName={medicine.name}
              stock={medicine.stock}
            /> */}
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
            Customer Reviews
            {medicine?.reviews?.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
                ({medicine?.reviews?.length})
              </span>
            )}
          </h2>

          {medicine?.reviews?.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
              <Star size={32} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Be the first to review this product.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {medicine?.reviews?.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {review?.user?.name ?? "Anonymous"}
                    </p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {review?.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}