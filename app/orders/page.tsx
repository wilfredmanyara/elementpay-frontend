"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import OrderForm, { OrderRequest } from "@/components/OrderForm";
import OrderReceipt from "@/components/OrderReceipt";
import OrderTimeout from "@/components/TimeoutScreen";
import OrderProcessingModal from "@/components/ProcessingModal";

import { useOrderTracking } from "@/hooks/useOrderTracking";
import { Order } from "@/lib/orders";

export default function OrderPage() {
  const { isConnected, address } = useAccount();

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { startOrderTracking, cleanup } = useOrderTracking({
    onFinalStatus: (order) => {
      setCurrentOrder(order);
      setIsProcessing(false);
      setShowReceipt(true);
    },
    onTimeout: () => {
      setTimeoutReached(true);
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (formData: OrderRequest) => {
    try {
      setIsProcessing(true);
      setTimeoutReached(false);

      const response = await fetch("/api/mock/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const order: Order = await response.json();
        setCurrentOrder(order);
        startOrderTracking(order.order_id);
      } else {
        setIsProcessing(false);
        console.error("Order creation failed");
      }
    } catch (err) {
      setIsProcessing(false);
      console.error("Error creating order:", err);
    }
  };

  const handleNewOrder = () => {
    setShowReceipt(false);
    setCurrentOrder(null);
    cleanup();
  };

  const handleRetry = () => {
    setTimeoutReached(false);
    setCurrentOrder(null);
    cleanup();
  };

  // === Conditional Views ===
  if (showReceipt && currentOrder) {
    return <OrderReceipt order={currentOrder} onNewOrder={handleNewOrder} />;
  }

  if (timeoutReached) {
    return <OrderTimeout onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Order
        </h1>

        {!isConnected ? (
          <div className="text-center">
            <p className="text-gray-800 mb-4">
              Connect your wallet to create an order
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800">
                Connected: <span className="font-mono">{address}</span>
              </p>
            </div>

            <OrderForm onSubmit={handleSubmit} disabled={isProcessing} />
          </>
        )}

        {isProcessing && currentOrder && (
          <OrderProcessingModal order={currentOrder} />
        )}
      </div>
    </div>
  );
}
