'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/config/routes';
import Image from 'next/image';

type Props = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Mock authentication check
  const isLoggedOn = true; // This will be replaced with actual auth state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate authentication check with 2-second delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsLoggedIn(isLoggedOn);

        if (!isLoggedOn) {
          // Redirect to login if not authenticated
          router.push(ROUTES.LOGIN);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push(ROUTES.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-white">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="mb-8">
            <Image src="/success-logo.png" alt="Success Education Logo" width={200} height={100} priority />
          </div>

          {/* Loading spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neutral-border border-t-primary-blue rounded-full animate-spin"></div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-black mb-2">Loading Dashboard</h2>
            <p className="text-neutral-darkGrey">Please wait while we verify your session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - this shouldn't be visible as we redirect,
  // but keeping as fallback
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-black mb-2">Access Denied</h2>
          <p className="text-neutral-darkGrey mb-4">Please log in to access the dashboard.</p>
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="px-6 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-blue/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
};

export default ProtectedRoute;
