import { io, Socket } from 'socket.io-client';
import { apiFetch } from './api';

let socket: Socket | null = null;

// Connects directly to the backend (not through the /api proxy — Vercel
// can't proxy long-lived WebSocket connections). Auth happens via a
// short-lived ticket instead of cookies, since this is a cross-site
// connection and SameSite=Lax cookies won't be sent here.
export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const { ticket } = await apiFetch<{ ticket: string }>('/realtime/ticket');

  const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  socket = io(backendUrl, {
    auth: { ticket },
    transports: ['websocket'],
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}