import { NextRequest } from 'next/server';

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('order_id');
  
  if (!orderId) {
    return new Response('Missing order_id parameter', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Store this connection
      connections.set(orderId, controller);
      
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected', order_id: orderId })}\n\n`);
    },
    cancel() {
      // Clean up connection
      connections.delete(orderId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Function to send webhook events to connected clients
export function notifyWebhookEvent(orderId: string, status: string) {
  const controller = connections.get(orderId);
  if (controller) {
    try {
      controller.enqueue(`data: ${JSON.stringify({ 
        type: 'webhook', 
        order_id: orderId, 
        status: status 
      })}\n\n`);
      
      // If this is a final status, close the connection
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