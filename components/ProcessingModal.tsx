"use client";

import { Order } from "@/lib/orders";

interface OrderProcessingModalProps {
  order: Order;
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
          Status: <span className="capitalize font-medium">{order.status}</span>
        </p>
        <p className="text-xs text-dark-200 mt-4 opacity-70">
          Polling every 3s • Listening for webhooks
        </p>
      </div>
    </div>
  );
}
