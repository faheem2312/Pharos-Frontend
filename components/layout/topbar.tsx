'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { BeaconStatus } from '@/components/beacon-status';
import { Button } from '@/components/ui/button';
import { apiFetch, clearTokens } from '@/lib/api';

export function Topbar() {
  const router = useRouter();

  async function handleLogout() {
    const refreshToken = localStorage.getItem('pharos_refresh_token');
    try {
      if (refreshToken) {
        await apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) });
      }
    } finally {
      clearTokens();
      router.push('/login');
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6">
      <BeaconStatus state="healthy" />
      <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </header>
  );
}
