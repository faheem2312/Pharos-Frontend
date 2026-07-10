'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiFetch } from '@/lib/api';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    apiFetch<UserRecord>('/users/me').then(setUser).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Editing isn't wired up yet — this is read-only for now.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input value={user?.name ?? ''} disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input value={user?.email ?? ''} disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <Input value={user?.role ?? ''} disabled className="capitalize" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}