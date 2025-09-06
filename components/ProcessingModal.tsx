"use client";

import { Order } from "@/lib/orders";

interface OrderProcessingModalProps {
  order: Order;
}

function StatusChip({ status }: { status: string }) {
  let color = "bg-gray-200 text-gray-800";
  if (status === "processing") color = "bg-blue-100 text-blue-700";
  if (status === "settled") color = "bg-green-100 text-green-700";
  if (status === "failed") color = "bg-red-100 text-red-700";
  if (status === "created") color = "bg-yellow-100 text-yellow-700";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function OrderProcessingModal({
  order,
}: OrderProcessingModalProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="gradient-border max-w-sm w-full text-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8e98ff] mx-auto mb-6"></div>
        <h2 className="mb-4">Processing Order</h2>
        <p className="text-dark-200 mb-4">
          Order ID: <span className="font-mono">{order.order_id}</span>
        </p>
        <p className="text-sm text-dark-200">
          Status: <StatusChip status={order.status} />
        </p>
      </div>
    </div>
  );
}
