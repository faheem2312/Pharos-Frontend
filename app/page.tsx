'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function RootPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // No token to check client-side anymore — just ask the backend if
    // the current cookies represent a valid session.
    apiFetch('/users/me')
      .then(() => router.replace('/dashboard'))
      .catch(() => router.replace('/login'))
      .finally(() => setChecked(true));
  }, [router]);

  return null;
}