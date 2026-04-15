"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/actions/seller.action";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define the status progression in order
const STATUS_FLOW = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

// Utility to get next status
const getNextStatus = (currentStatus: string) => {
  const idx = STATUS_FLOW.indexOf(currentStatus as typeof STATUS_FLOW[number]);
  return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
};

// Utility to get button label
const getNextLabel = (currentStatus: string) => {
  const nextStatus = getNextStatus(currentStatus);
  return nextStatus ? `Mark ${nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}` : null;
};

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancelling, setCancelling] = useState(false);

  const nextStatus = getNextStatus(currentStatus);
  const nextLabel = getNextLabel(currentStatus);

  const advance = () => {
    if (!nextStatus) return;
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, nextStatus);
      if (res?.success) {
        toast.success(`Order marked as ${nextStatus.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(res?.message ?? "Failed to update");
      }
    });
  };

  const cancel = async () => {
    setCancelling(true);
    const res = await updateOrderStatusAction(orderId, "CANCELLED");
    setCancelling(false);
    if (res?.success) {
      toast.success("Order cancelled");
      router.refresh();
    } else {
      toast.error(res?.message ?? "Failed to cancel");
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {nextStatus && (
        <button
          onClick={advance}
          disabled={isPending}
          className="inline-flex items-center gap-1 bg-[#0b1f3a] dark:bg-[#2ecc8a] text-white dark:text-[#0b1f3a] text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap"
        >
          {isPending ? <Loader2 size={11} className="animate-spin" /> : <ChevronRight size={11} />}
          {nextLabel}
        </button>
      )}
      <button
        onClick={cancel}
        disabled={cancelling || isPending}
        className="text-xs text-red-400 hover:text-red-600 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-40 whitespace-nowrap"
      >
        {cancelling ? <Loader2 size={11} className="animate-spin inline" /> : "Cancel"}
      </button>
    </div>
  );
}