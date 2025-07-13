import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import TanstackProvider from "@/context/tanstack-context";
import { ToastProvider } from "@/context/toast-context";
import { sfProDisplay } from "@/assets/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Success Platform",
    template: "%s | Success Education & Visa Services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sfProDisplay.className} antialiased`}>
        <ToastProvider>
          <TanstackProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TanstackProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
