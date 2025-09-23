import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import TanstackProvider from '@/context/tanstack-context';
import { ToastProvider } from '@/context/toast-context';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Success Education & Visa Services',
    template: '%s | Success Education & Visa Services',
  },
};

const inter = Inter_Tight({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <TanstackProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TanstackProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
