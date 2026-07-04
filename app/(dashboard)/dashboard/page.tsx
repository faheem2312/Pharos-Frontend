'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, Zap, AlertTriangle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

// Placeholder series until the /logs and rate-limit endpoints are wired up —
// shaped exactly like what those endpoints will eventually return, so
// swapping in real data later is a one-line change.
const requestSeries = [
  { time: '00:00', requests: 240 },
  { time: '04:00', requests: 139 },
  { time: '08:00', requests: 980 },
  { time: '12:00', requests: 1390 },
  { time: '16:00', requests: 1100 },
  { time: '20:00', requests: 860 },
  { time: 'now', requests: 940 },
];

const STAT_CARDS = [
  { label: 'Requests (24h)', value: '48.2K', icon: Activity, tone: 'default' as const },
  { label: 'Active team members', value: '3', icon: Users, tone: 'default' as const },
  { label: 'Avg. response time', value: '182ms', icon: Zap, tone: 'success' as const },
  { label: 'Rate-limit rejections', value: '12', icon: AlertTriangle, tone: 'warning' as const },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ name: string }>('/users/me')
      .then((u) => setUserName(u.name))
      .catch(() => {
        // Not authenticated or backend not running yet — the dashboard
        // still renders with placeholder data so the UI can be reviewed
        // independently of the API being up.
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Overview'}
        </h1>
        <p className="text-sm text-muted-foreground">Here's what your systems looked like today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-mono text-2xl font-medium">{value}</p>
              </div>
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md',
                  tone === 'success' && 'bg-beacon-teal/15 text-beacon-teal',
                  tone === 'warning' && 'bg-primary/15 text-primary',
                  tone === 'default' && 'bg-secondary text-muted-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Request volume</CardTitle>
          <Badge variant="success">Live</Badge>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={requestSeries}>
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
