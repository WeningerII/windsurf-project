import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { registerToastHandler, ToastVariant } from '../../utils/notifications';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

let nextId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    registerToastHandler(toast);
    return () => registerToastHandler(null);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        role="region"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastNotification key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-destructive/30 bg-destructive/10',
  info: 'border-primary/30 bg-primary/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
};

const VARIANT_ICONS: Record<ToastVariant, React.FC<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const ToastNotification: React.FC<{ item: ToastItem; onDismiss: (id: number) => void }> = ({
  item,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), 4000);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  const Icon = VARIANT_ICONS[item.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right ${VARIANT_STYLES[item.variant]}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm flex-1">{item.message}</span>
      <button
        onClick={() => onDismiss(item.id)}
        className="text-muted-foreground hover:text-foreground"
        title="Dismiss"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
