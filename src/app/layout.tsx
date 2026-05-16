import type { Metadata } from 'next';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import TanstackProvider from '@/context/tanstack-context';
import { ToastProvider } from '@/context/toast-context';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Success Education & Visa Services',
    template: '%s | Success Education & Visa Services',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Load FaceIO early. fio.js declares `class faceIO` at the top level
            of a classic script — that creates a lexical global, NOT a window
            property — so we follow it with an inline bridge that copies it
            onto window for ES-module callers (see src/lib/faceio.ts).
            We intentionally DO NOT render `<div id="faceio-modal" />` here:
            fio.js's bootstrap creates one on its own and attaches a Shadow
            DOM to it, which React 19 hydration would otherwise strip. */}
        <Script src="https://cdn.faceio.net/fio.js" strategy="beforeInteractive" />
        <Script id="faceio-bridge" strategy="beforeInteractive">
          {'if(typeof faceIO!=="undefined"&&!window.faceIO){window.faceIO=faceIO;}'}
        </Script>

        <ToastProvider>
          <TanstackProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TanstackProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
