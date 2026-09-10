'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Placeholder param emitted by generateStaticParams for every [id] segment. */
const SENTINEL = '__id__';

function idFromPath(path: string): string {
  // Every record route is /dashboard/<section>/<id>/...
  const id = path.split('/').filter(Boolean)[2] ?? '';
  return id === SENTINEL ? '' : id;
}

/**
 * The real record id for a /dashboard/<section>/[id]/... route.
 *
 * `output: 'export'` prerenders each of these routes exactly once, under the
 * `__id__` sentinel, and the RSC payload pins `params.id` to that sentinel. So
 * `useParams()` keeps reporting `__id__` on a cold load even though the browser
 * is at /dashboard/leads/123/view -- CloudFront rewrote the path to reach the
 * prerendered document. Read the id back off the URL instead.
 *
 * Returns '' until hydration completes, which keeps the first client render
 * identical to the prerendered HTML. Callers must not render id-dependent
 * children (or run id-dependent queries) while it is empty.
 */
export function useRouteId(): string {
  const pathname = usePathname();
  const [browserPath, setBrowserPath] = useState<string | null>(null);

  // Re-read on every router move so client-side navigations stay correct.
  useEffect(() => {
    setBrowserPath(window.location.pathname);
  }, [pathname]);

  return idFromPath(browserPath ?? pathname);
}
