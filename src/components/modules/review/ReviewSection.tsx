"use client";

import { useState, useTransition } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createReviewAction } from "@/actions/review.action";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  user?: { name: string };
}

interface Props {
  medicineId: string;
  initialReviews: Review[];
}

export default function ReviewSection({
  medicineId,
  initialReviews,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!rating) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    startTransition(async () => {
      const res = await createReviewAction({
        medicineId,
        rating,
        comment,
      });

      if (res.error) {
        const message =
          res.error?.error || res.error?.message || "Failed to add review";

        if (message.includes("purchased")) {
          toast.error("You must purchase this medicine before reviewing");
          return;
        }

        if (message.includes("already reviewed")) {
          toast.error("You already reviewed this product");
          return;
        }

        toast.error(message);
        return;
      }

      // ✅ Add new review to UI immediately
      const newReview: Review = {
        id: res.data.id,
        rating,
        comment,
        user: { name: "You" }, // optional placeholder
      };

      setReviews((prev) => [newReview, ...prev]);

      toast.success("Review added!");

      // reset form
      setRating(0);
      setComment("");
    });
  };

  return (
    <div className="space-y-6">
      {/* ───── Write Review ───── */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Write a Review
        </h3>

        {/* Stars */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={i}
                size={20}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                className={`cursor-pointer transition ${
                  starValue <= (hover || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            );
          })}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />

        <button
          onClick={handleSubmit}
          disabled={pending}
          className="mt-3 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          Submit Review
        </button>
      </div>

      {/* ───── Reviews List ───── */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between mb-2">
                <p className="font-medium text-sm text-gray-800 dark:text-white">
                  {r.user?.name ?? "Anonymous"}
                </p>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < r.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {r.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {r.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}