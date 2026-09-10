// `output: 'export'` needs a concrete set of params for every dynamic segment.
// Record ids are unbounded, so we emit a single sentinel page and let a
// CloudFront Function rewrite /dashboard/<section>/<realId>/... onto it.
// The pages below read the real id client-side via useRouteId().
//
// dynamicParams is deliberately not set: export mode forces it false, while
// dev and a normal server build need it left true so real ids still render.
export function generateStaticParams() {
  return [{ id: '__id__' }];
}

export default function IdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
