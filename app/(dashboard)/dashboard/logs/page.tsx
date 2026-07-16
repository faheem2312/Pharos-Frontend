'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface LogEvent {
  id: string;
  type: string;
  message: string;
  userId: string | null;
  createdAt: string;
}

function badgeVariantFor(type: string): 'default' | 'success' | 'destructive' | 'secondary' {
  if (type.includes('failed') || type.includes('exceeded')) return 'destructive';
  if (type.includes('registered') || type.includes('success')) return 'success';
  return 'secondary';
}

export default function LogsPage() {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let active = true;

  connectSocket().then((socket) => {
    socket.on('log', (newEvent: LogEvent) => {
      if (!active) return;
      // Prepend the live event only if there's no active search filter —
      // otherwise a live push could show up even though it doesn't match
      // what's currently being searched for, which would be confusing.
      setEvents((prev) => (query ? prev : [newEvent, ...prev]));
    });
  });

  return () => {
    active = false;
    disconnectSocket();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    // Debounce so we're not firing a full-text search query on every
    // keystroke — 300ms is enough to feel instant without hammering
    // Postgres while someone's mid-word.
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      apiFetch<LogEvent[]>(`/logs?${params.toString()}`)
        .then(setEvents)
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Logs</h1>
        <p className="text-sm text-muted-foreground">
          Search across every recorded event — registrations, logins, rate limits.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search logs (e.g. an email address)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          ) : events.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No events found.</div>
          ) : (
            <div className="divide-y divide-border">
              {events.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-4 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeVariantFor(event.type)}>{event.type}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{event.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}