// Cookies are httpOnly and sent automatically by the browser on every
// request — there's no token to read, store, or manually attach anymore.
// The only thing this file still needs to do is call fetch with
// `credentials: 'include'` so the browser actually sends cookies (it
// won't by default on same-origin fetches inside some edge cases, and
// being explicit here costs nothing).

export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`API error ${status}`);
  }
}

async function tryRefresh(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });
  return res.ok;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const doFetch = () =>
    fetch(`/api${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

  let res = await doFetch();

  // Access token cookie expired mid-session — refresh once, silently,
  // and retry. The refresh endpoint sets a fresh cookie automatically;
  // we don't need to read or store anything ourselves.
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}