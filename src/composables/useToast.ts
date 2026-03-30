import { ref, readonly } from "vue";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
  onDismiss?: () => void;
}

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
  position: ToastPosition;
  action?: ToastAction;
  onDismiss?: () => void;
}

const DEFAULT_DURATION = 10_000;
const DEFAULT_POSITION: ToastPosition = "bottom-right";

const toasts = ref<ToastData[]>([]);

let counter = 0;

function getByPosition(position: ToastPosition) {
  return toasts.value.find((toast) => toast.position === position);
}

function show(type: ToastType, message: string, options: ToastOptions = {}) {
  const position = options.position ?? DEFAULT_POSITION;

  dismiss(position);

  toasts.value.push({
    id: `toast-${++counter}`,
    type,
    message,
    title: options.title,
    duration: options.duration ?? DEFAULT_DURATION,
    position,
    action: options.action,
    onDismiss: options.onDismiss,
  });
}

function dismiss(position: ToastPosition) {
  const existing = getByPosition(position);
  if (!existing) return;

  existing.onDismiss?.();
  toasts.value = toasts.value.filter((toast) => toast.position !== position);
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    getByPosition,
    success: (message: string, options?: ToastOptions) =>
      show("success", message, options),
    error: (message: string, options?: ToastOptions) =>
      show("error", message, options),
    warning: (message: string, options?: ToastOptions) =>
      show("warning", message, options),
    info: (message: string, options?: ToastOptions) =>
      show("info", message, options),
    dismiss,
  };
}
