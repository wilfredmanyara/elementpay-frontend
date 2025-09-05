"use client";

import { Order } from "@/lib/orders";

interface OrderReceiptProps {
  order: Order;
  onNewOrder: () => void;
}

export default function OrderReceipt({ order, onNewOrder }: OrderReceiptProps) {
  return (
    <div className="main-section">
      <div className="gradient-border max-w-md w-full">
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              order.status === "settled" ? "bg-badge-green" : "bg-badge-red"
            }`}
          >
            {order.status === "settled" ? (
              <svg
                className="w-8 h-8 text-badge-green-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-badge-red-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          <h1 className="mb-6">
            Order {order.status === "settled" ? "Completed" : "Failed"}
          </h1>

          <div className="text-left space-y-4 mb-8 gradient-border">
            <div className="flex justify-between items-center">
              <span className="font-medium text-dark-200">Order ID:</span>
              <span className="font-mono text-sm">{order.order_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-dark-200">Amount:</span>
              <span className="font-semibold">
                {order.amount} {order.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-dark-200">Token:</span>
              <span className="font-semibold">{order.token}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-dark-200">Status:</span>
              <span
                className={`score-badge ${
                  order.status === "settled"
                    ? "bg-badge-green text-badge-green-text"
                    : "bg-badge-red text-badge-red-text"
                }`}
              >
                {order.status}
              </span>
            </div>
            {order.note && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-dark-200">Note:</span>
                <span>{order.note}</span>
              </div>
            )}
          </div>

          <button onClick={onNewOrder} className="primary-button">
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );
}
