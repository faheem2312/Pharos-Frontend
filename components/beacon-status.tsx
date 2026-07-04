import { cn } from '@/lib/utils';

type BeaconState = 'healthy' | 'degraded' | 'down';

const STATE_CONFIG: Record<BeaconState, { color: string; label: string; sweep: boolean }> = {
  healthy: { color: 'bg-beacon-teal', label: 'All systems normal', sweep: false },
  degraded: { color: 'bg-beacon-amber', label: 'Degraded performance', sweep: true },
  down: { color: 'bg-destructive', label: 'Service disruption', sweep: true },
};

// The signature element: a lighthouse beacon standing in for system health.
// A steady light means everything's fine. A sweeping light means something
// needs attention — the same visual language a real lighthouse uses.
export function BeaconStatus({ state = 'healthy' }: { state?: BeaconState }) {
  const config = STATE_CONFIG[state];

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-3 w-3 items-center justify-center">
        {config.sweep && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-beacon-sweep rounded-full',
              'bg-[conic-gradient(from_0deg,transparent_0deg,transparent_260deg,currentColor_360deg)]',
              state === 'degraded' ? 'text-beacon-amber' : 'text-destructive',
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            config.color,
            !config.sweep && 'animate-beacon-pulse',
          )}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}
