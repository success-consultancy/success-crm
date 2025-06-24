/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../ui/toaster';

interface Providers {
  children?: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 25, // 25 seconds
      retry: (failureCount, error) => {
        if ((error as any)?.response?.status === 404) {
          return false;
        } else if (failureCount < 3) {
          return true;
        } else return false;
      },
    },
  },
});

const Providers: React.FC<Providers> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <Toaster />
    </QueryClientProvider>
  );
};

export { queryClient };
export default Providers;
