'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamPage() {
  const [user, setUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    apiFetch<UserRecord>('/users/me').then(setUser).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Team</h1>
        <p className="text-sm text-muted-foreground">
          Everyone with access to this Pharos workspace.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {user ? (
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </div>
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Inviting teammates isn't wired up yet — this page currently just shows your own account.
      </p>
    </div>
  );
}