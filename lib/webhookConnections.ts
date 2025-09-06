const connections = new Map<string, ReadableStreamDefaultController>();

export function addConnection(orderId: string, controller: ReadableStreamDefaultController) {
  connections.set(orderId, controller);
}

export function removeConnection(orderId: string) {
  connections.delete(orderId);
}

export function notifyWebhookEvent(orderId: string, status: string) {
  const controller = connections.get(orderId);
  if (controller) {
    try {
      controller.enqueue(`data: ${JSON.stringify({ 
        type: 'webhook', 
        order_id: orderId, 
        status: status 
      })}\n\n`);
      if (status === 'settled' || status === 'failed') {
        controller.close();
        connections.delete(orderId);
      }
    } catch (error) {
      console.error('Error sending webhook event:', error);
      connections.delete(orderId);
    }
  }
}

export { connections };