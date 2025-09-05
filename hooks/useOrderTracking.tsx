"use client";

import { useRef, useEffect } from "react";
import { Order } from "@/lib/orders";

interface UseOrderTrackingProps {
  onStatusUpdate?: (order: Order) => void;
  onFinalStatus: (order: Order) => void;
  onTimeout: () => void;
}

export function useOrderTracking({ onStatusUpdate, onFinalStatus, onTimeout }: UseOrderTrackingProps) {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const finalizedRef = useRef(false);

  const cleanup = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const handleFinalStatus = (order: Order, source: "polling" | "webhook") => {
    if (finalizedRef.current) return;
    if (order.status === "settled" || order.status === "failed") {
      finalizedRef.current = true;
      cleanup();
      onFinalStatus(order);
    } else {
      onStatusUpdate?.(order);
    }
  };

  const pollOrderStatus = async (orderId: string) => {
    try {
      const res = await fetch(`/api/mock/orders/${orderId}`);
      if (res.ok) {
        const order: Order = await res.json();
        handleFinalStatus(order, "polling");
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  const setupWebhookListener = (orderId: string) => {
    eventSourceRef.current = new EventSource(`/api/webhooks/listen?order_id=${orderId}`);
    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "webhook" && data.order_id === orderId) {
          handleFinalStatus(
            {
              order_id: orderId,
              status: data.status,
              amount: data.amount,
              currency: data.currency,
              token: data.token,
              note: data.note || "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            "webhook"
          );
        }
      } catch (err) {
        console.error("Webhook error:", err);
      }
    };
  };

  const startOrderTracking = (orderId: string) => {
    finalizedRef.current = false;
    pollOrderStatus(orderId);
    setupWebhookListener(orderId);

    pollingIntervalRef.current = setInterval(() => pollOrderStatus(orderId), 3000);

    timeoutRef.current = setTimeout(() => {
      if (!finalizedRef.current) {
        cleanup();
        onTimeout();
      }
    }, 60000);
  };

  useEffect(() => cleanup, []);

  return { startOrderTracking, cleanup };
}
