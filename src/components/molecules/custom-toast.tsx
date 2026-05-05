'use client';

import { ReactNode } from 'react';
import { CheckCircle2, Info, XCircle, AlertTriangle, X, Loader2 } from 'lucide-react';
import toast, { Toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastAction {
  label: string;
  onClick: (id: string) => void;
}

interface CustomToastProps {
  t: Toast;
  variant: ToastVariant;
  message: ReactNode;
  action?: ToastAction;
}

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: string; iconBg: string }> = {
  success: {
    container: 'border-green-200 bg-green-50 text-green-800',
    icon: 'text-green-600',
    iconBg: 'bg-white',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: 'text-red-600',
    iconBg: 'bg-white',
  },
  info: {
    container: 'border-sky-200 bg-sky-50 text-sky-800',
    icon: 'text-sky-600',
    iconBg: 'bg-white',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 text-amber-800',
    icon: 'text-amber-600',
    iconBg: 'bg-white',
  },
  loading: {
    container: 'border-gray-200 bg-gray-50 text-gray-800',
    icon: 'text-gray-600',
    iconBg: 'bg-white',
  },
};

const VARIANT_ICON: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
  loading: Loader2,
};

const ACTION_COLOR: Record<ToastVariant, string> = {
  success: 'text-green-700 hover:text-green-900',
  error: 'text-red-700 hover:text-red-900',
  info: 'text-sky-700 hover:text-sky-900',
  warning: 'text-amber-700 hover:text-amber-900',
  loading: 'text-gray-700 hover:text-gray-900',
};

export const CustomToast = ({ t, variant, message, action }: CustomToastProps) => {
  const styles = VARIANT_STYLES[variant];
  const Icon = VARIANT_ICON[variant];

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex items-center gap-2 rounded-full border px-2 py-1.5 pr-2 shadow-sm min-w-[280px] max-w-md text-sm',
        'transition-all duration-150',
        t.visible ? 'animate-in fade-in slide-in-from-top-2' : 'animate-out fade-out',
        styles.container,
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          styles.iconBg,
        )}
      >
        <Icon
          className={cn('h-4 w-4', styles.icon, variant === 'loading' && 'animate-spin')}
        />
      </span>

      <span className="flex-1 px-1 leading-snug">{message}</span>

      {action && (
        <button
          type="button"
          onClick={() => action.onClick(t.id)}
          className={cn(
            'shrink-0 px-2 py-0.5 text-sm font-semibold underline-offset-2 hover:underline cursor-pointer',
            ACTION_COLOR[variant],
          )}
        >
          {action.label}
        </button>
      )}

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-white/60 hover:text-gray-800 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.25} />
      </button>
    </div>
  );
};

export default CustomToast;
