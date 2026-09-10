import type { NextConfig } from 'next';

// Static export is opt-in, via `bun run build-success-crm`.
//
// Turning it on unconditionally also changes `next dev` and a plain
// `next build`: dev refuses any /[id]/ route whose id is not listed in
// generateStaticParams, and a normal server build would stop being one.
// So it applies only to the S3/CloudFront build.
const isStaticExport = process.env.NEXT_OUTPUT_EXPORT === 'true';

const nextConfig: NextConfig = {
  devIndicators: false,

  // Emit ./out instead of a server build.
  ...(isStaticExport ? { output: 'export' as const } : {}),

  // Emit `path/index.html` so S3 serves directory-style URLs directly.
  trailingSlash: true,

  // next/image optimisation needs a server; export requires it off.
  images: { unoptimized: true },
};

export default nextConfig;
