"use client";

import { Order } from "@/lib/orders";

interface OrderProcessingModalProps {
  order: Order;
}

export default function OrderProcessingModal({ order }: OrderProcessingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Order</h3>
        <p className="text-gray-800 mb-4">
          Order ID: <span className="font-mono">{order.order_id}</span>
        </p>
        <p className="text-sm text-gray-700">
          Status: <span className="capitalize font-medium text-gray-900">{order.status}</span>
        </p>
        <p className="text-xs text-gray-600 mt-2">Polling every 3s • Listening for webhooks</p>
      </div>
    </div>
  );
}
