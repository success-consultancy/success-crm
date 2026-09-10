'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// A server-side redirect() cannot run in a static export -- it makes the build
// emit a Next error document for "/" instead of a redirect. Redirect on the
// client so the exported index.html works when served from S3/CloudFront.
const page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
};

export default page;
