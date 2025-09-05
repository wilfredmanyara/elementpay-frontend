"use client";

import { Order } from "@/lib/orders";

interface OrderReceiptProps {
  order: Order;
  onNewOrder: () => void;
}

export default function OrderReceipt({ order, onNewOrder }: OrderReceiptProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              order.status === "settled" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {order.status === "settled" ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order {order.status === "settled" ? "Completed" : "Failed"}
          </h2>

          <div className="text-left space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Order ID:</span>
              <span className="font-mono text-sm">{order.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Amount:</span>
              <span className="font-semibold">{order.amount} {order.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Token:</span>
              <span className="font-semibold">{order.token}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Status:</span>
              <span className={`capitalize font-semibold ${order.status === "settled" ? "text-green-600" : "text-red-600"}`}>
                {order.status}
              </span>
            </div>
            {order.note && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Note:</span>
                <span>{order.note}</span>
              </div>
            )}
          </div>

          <button
            onClick={onNewOrder}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
}
