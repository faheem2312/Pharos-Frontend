'use client';

import { useEffect, useState } from 'react';
import { Activity, UserPlus, ShieldAlert, LogIn } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';

interface TypeCount {
  type: string;
  count: number;
}

interface HourlyPoint {
  hour: string;
  count: number;
}

interface LogsStats {
  typeCounts: TypeCount[];
  hourly: HourlyPoint[];
}

function countFor(typeCounts: TypeCount[], type: string): number {
  return typeCounts.find((t) => t.type === type)?.count ?? 0;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState<LogsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ name: string }>('/users/me')
      .then((u) => setUserName(u.name))
      .catch(() => {
        // Not authenticated yet — page still renders, just without a name.
      });

    apiFetch<LogsStats>('/logs/stats')
      .then(setStats)
      .catch(() => {
        // No events yet, or backend not reachable — chart/cards fall back
        // to an empty state below rather than crashing.
      })
      .finally(() => setLoading(false));
  }, []);

  const totalEvents24h = stats?.typeCounts.reduce((sum, t) => sum + t.count, 0) ?? 0;
  const registrations = stats ? countFor(stats.typeCounts, 'user.registered') : 0;
  const failedLogins = stats ? countFor(stats.typeCounts, 'user.login_failed') : 0;
  const rateLimited = stats ? countFor(stats.typeCounts, 'rate_limit.exceeded') : 0;

  const statCards = [
    { label: 'Events (24h)', value: totalEvents24h, icon: Activity, tone: 'default' as const },
    { label: 'Registrations (24h)', value: registrations, icon: UserPlus, tone: 'success' as const },
    { label: 'Failed logins (24h)', value: failedLogins, icon: LogIn, tone: 'warning' as const },
    { label: 'Rate-limit rejections (24h)', value: rateLimited, icon: ShieldAlert, tone: 'warning' as const },
  ];

  // Turn hourly buckets into chart-friendly points, formatting the
  // timestamp down to just the hour for a clean x-axis label.
  const chartData = (stats?.hourly ?? []).map((point) => ({
    time: new Date(point.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    events: point.count,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Overview'}
        </h1>
        <p className="text-sm text-muted-foreground">Here's what your systems looked like today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-mono text-2xl font-medium">{loading ? '—' : value}</p>
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
          <CardTitle>Event volume (last 24h)</CardTitle>
          <Badge variant="success">Live</Badge>
        </CardHeader>
        <CardContent className="h-64">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {loading ? 'Loading…' : 'No events recorded yet — try registering or logging in a few times.'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <Line type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}