'use client';

import React, { createContext, useContext, useMemo } from 'react';
import toast, { Toaster, ToastOptions, resolveValue, Toast } from 'react-hot-toast';
import CustomToast, { ToastVariant } from '@/components/molecules/custom-toast';

interface ToastActionOption {
  label: string;
  onClick: (id: string) => void;
}

interface ExtendedToastOptions extends ToastOptions {
  action?: ToastActionOption;
}

type ToastContextType = {
  success: (message: string, options?: ExtendedToastOptions) => string;
  error: (message: string, options?: ExtendedToastOptions) => string;
  info: (message: string, options?: ExtendedToastOptions) => string;
  warning: (message: string, options?: ExtendedToastOptions) => string;
  loading: (message: string, options?: ExtendedToastOptions) => string;
  dismiss: (id?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
  ) => Promise<T>;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Renders any toast (whether dispatched via toast.success / toast.error / toast.custom)
// with our shared design. For toasts created via toast.custom() — used by info/warning
// helpers below — we render the message directly so the helper retains full control.
const renderToast = (t: Toast) => {
  if (t.type === 'custom') {
    return <>{resolveValue(t.message, t)}</>;
  }

  const variant: ToastVariant =
    t.type === 'success'
      ? 'success'
      : t.type === 'error'
        ? 'error'
        : t.type === 'loading'
          ? 'loading'
          : 'info';

  return <CustomToast t={t} variant={variant} message={resolveValue(t.message, t)} />;
};

const fireCustom = (
  variant: ToastVariant,
  message: string,
  options?: ExtendedToastOptions,
): string => {
  const { action, ...rest } = options ?? {};
  return toast.custom(
    (t) => <CustomToast t={t} variant={variant} message={message} action={action} />,
    rest,
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo<ToastContextType>(
    () => ({
      success: (message, options) => {
        // Use toast.custom so we can attach an action; native toast.success ignores it.
        if (options?.action) return fireCustom('success', message, options);
        return toast.success(message, options);
      },
      error: (message, options) => {
        if (options?.action) return fireCustom('error', message, options);
        return toast.error(message, options);
      },
      info: (message, options) => fireCustom('info', message, options),
      warning: (message, options) => fireCustom('warning', message, options),
      loading: (message, options) => {
        if (options?.action) return fireCustom('loading', message, options);
        return toast.loading(message, options);
      },
      dismiss: (id) => toast.dismiss(id),
      promise: (promiseToResolve, options) => toast.promise(promiseToResolve, options),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          success: { duration: 3000 },
          error: { duration: 4000 },
        }}
      >
        {renderToast}
      </Toaster>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
