'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Copy, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';

interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  revoked: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadKeys = () => {
    apiFetch<ApiKeyRecord[]>('/api-keys')
      .then(setKeys)
      .catch(() => setKeys([]));
  };

  useEffect(() => {
    loadKeys();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const result = await apiFetch<{ id: string; rawKey: string }>('/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      // The raw key is only ever available in this response — shown once,
      // never retrievable again after this.
      setFreshKey(result.rawKey);
      setName('');
      loadKeys();
    } catch {
      // swallow — form stays as-is, user can retry
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    await apiFetch(`/api-keys/${id}`, { method: 'DELETE' });
    loadKeys();
  }

  function copyKey() {
    if (!freshKey) return;
    navigator.clipboard.writeText(freshKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">API keys</h1>
        <p className="text-sm text-muted-foreground">
          Authenticate scripts and integrations without a browser session.
        </p>
      </div>

      {freshKey && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Copy your key now</CardTitle>
            <CardDescription>
              This is the only time you'll see the full key. It won't be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-secondary px-3 py-2 font-mono text-sm">
                {freshKey}
              </code>
              <Button variant="outline" size="icon" onClick={copyKey}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => setFreshKey(null)}>
              Done, dismiss this
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a new key</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex items-end gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="key-name">Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. CI pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? 'Creating…' : 'Create key'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {keys.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No API keys yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{key.name}</p>
                        {key.revoked && <Badge variant="destructive">Revoked</Badge>}
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {key.keyPrefix}… ·{' '}
                        {key.lastUsedAt
                          ? `last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                          : 'never used'}
                      </p>
                    </div>
                  </div>
                  {!key.revoked && (
                    <Button variant="ghost" size="icon" onClick={() => handleRevoke(key.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}