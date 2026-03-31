import { type Component, shallowRef } from "vue";

export type DismissReason =
  | "escape"
  | "backdrop"
  | "swipe"
  | "close-button"
  | "programmatic";

export type ModalSize = "small" | "medium" | "large";

export interface ModalOptions {
  component: Component;
  componentProps?: Record<string, unknown>;
  size?: ModalSize;
  autoHeight?: boolean;
  showHandle?: boolean;
  backdropDismiss?: boolean;
  canDismiss?: (reason: DismissReason) => boolean;
  preventEscapeDismiss?: boolean;
  preventSwipeDismiss?: boolean;
  preventBackdropDismiss?: boolean;
  onPresent?: () => void;
  onWillDismiss?: () => void;
  onDidDismiss?: () => void;
}

export interface ModalResult<T = unknown> {
  data: T | null;
  role: string;
}

export interface ModalInstance {
  id: number;
  options: ModalOptions;
  resolve: (result: ModalResult) => void;
  isDesktop: boolean;
}

let counter = 0;
const modalStack = shallowRef<ModalInstance[]>([]);

export function checkCanDismiss(
  instance: ModalInstance,
  reason: DismissReason,
): boolean {
  const opts = instance.options;
  if (reason === "escape" && opts.preventEscapeDismiss) return false;
  if (reason === "swipe" && opts.preventSwipeDismiss) return false;
  if (
    reason === "backdrop" &&
    (opts.preventBackdropDismiss || opts.backdropDismiss === false)
  )
    return false;
  if (opts.canDismiss && !opts.canDismiss(reason)) return false;
  return true;
}

export function showModal<T = unknown>(
  options: ModalOptions,
): Promise<ModalResult<T>> {
  return new Promise((resolve) => {
    const isDesktop = window.innerWidth >= 1200;
    const instance: ModalInstance = {
      id: ++counter,
      options,
      resolve: resolve as (result: ModalResult) => void,
      isDesktop,
    };
    modalStack.value = [...modalStack.value, instance];
  });
}

export function dismissInstance(
  instance: ModalInstance,
  data?: unknown,
  role?: string,
) {
  const stack = modalStack.value;
  const index = stack.indexOf(instance);
  if (index === -1) return;
  instance.options.onWillDismiss?.();
  modalStack.value = [...stack.slice(0, index), ...stack.slice(index + 1)];
  instance.resolve({ data: data ?? null, role: role ?? "dismiss" });
  instance.options.onDidDismiss?.();
}

export function dismiss(data?: unknown, role?: string) {
  const stack = modalStack.value;
  if (stack.length === 0) return;
  dismissInstance(stack[stack.length - 1], data, role);
}

export function dismissAll() {
  const stack = [...modalStack.value];
  modalStack.value = [];
  for (let i = stack.length - 1; i >= 0; i--) {
    stack[i].options.onWillDismiss?.();
    stack[i].resolve({ data: null, role: "dismiss-all" });
    stack[i].options.onDidDismiss?.();
  }
}

export function useModal() {
  return {
    modalStack,
    showModal,
    dismiss,
    dismissAll,
  } as const;
}
