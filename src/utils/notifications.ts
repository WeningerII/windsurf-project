export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

type ToastHandler = (message: string, variant?: ToastVariant) => void;

let toastHandler: ToastHandler | null = null;

export function registerToastHandler(handler: ToastHandler | null): void {
  toastHandler = handler;
}

export function emitToast(message: string, variant: ToastVariant = 'info'): void {
  toastHandler?.(message, variant);
}
