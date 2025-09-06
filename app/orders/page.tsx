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
    onStatusUpdate: (order) => {
      setCurrentOrder(order);
    },
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

  if (showReceipt && currentOrder) {
    return <OrderReceipt order={currentOrder} onNewOrder={handleNewOrder} />;
  }

  if (timeoutReached) {
    return <OrderTimeout onRetry={handleRetry} />;
  }

  return (
    <div className="main-section mt-16 px-4">
      <div className="gradient-border max-w-md md:max-w-lg w-full mx-auto">
        <div className="page-heading">
          <h1 className="text-2xl md:text-3xl">Create Order</h1>
        </div>

        {!isConnected ? (
          <div className="text-center flex flex-col items-center space-y-4">
            <p className="text-dark-200 text-sm md:text-base">
              Connect your wallet to create an order
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            <div className="gradient-border mb-6">
              <p className="text-xs md:text-sm text-dark-200 break-all">
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
