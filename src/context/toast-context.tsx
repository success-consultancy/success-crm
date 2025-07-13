"use client";

import React, { createContext, useContext } from "react";
import toast, { Toaster, ToastOptions } from "react-hot-toast";

type ToastContextType = {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, options);
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, options);
  };

  const dismiss = (id?: string) => {
    toast.dismiss(id);
  };

  const promise = <T,>(
    promiseToResolve: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promiseToResolve, options);
  };

  const value: ToastContextType = {
    success,
    error,
    loading,
    dismiss,
    promise,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
