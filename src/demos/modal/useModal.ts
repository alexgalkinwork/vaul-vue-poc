import {
  type Component,
  type InjectionKey,
  markRaw,
  readonly,
  shallowRef
} from 'vue';

export type DismissReason =
  | 'escape'
  | 'backdrop'
  | 'swipe'
  | 'close-button'
  | 'programmatic';

export type ModalSize = 'small' | 'medium' | 'large';

export type Dismissible = true | 'persistent' | false;

export interface ModalOptions {
  component: Component;
  componentProps?: Record<string, unknown>;
  size?: ModalSize;
  autoHeight?: boolean;
  dismissible?: Dismissible;
  canDismiss?: (reason: DismissReason) => boolean;
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
  complete: (result: ModalResult) => void;
  isDesktop: boolean;
}

export const MODAL_DISMISSIBLE_KEY: InjectionKey<Dismissible> =
  Symbol('modal-dismissible');

let counter = 0;
const stack = shallowRef<ModalInstance[]>([]);

export function checkCanDismiss(
  instance: ModalInstance,
  reason: DismissReason
): boolean {
  const dismissible = instance.options.dismissible ?? true;

  if (dismissible === false) return false;

  if (dismissible === 'persistent') {
    if (reason === 'swipe' || reason === 'backdrop') return false;
  }

  if (instance.options.canDismiss && !instance.options.canDismiss(reason))
    return false;

  return true;
}

export function dismissInstance(
  instance: ModalInstance,
  data: unknown = null,
  role = 'dismiss'
) {
  if (!stack.value.includes(instance)) return;

  instance.options.onWillDismiss?.();
  stack.value = stack.value.filter(i => i !== instance);
  instance.complete({ data, role });
  instance.options.onDidDismiss?.();
}

function showModal<T = unknown>(
  options: ModalOptions
): Promise<ModalResult<T>> {
  const { promise, resolve } = Promise.withResolvers<ModalResult<T>>();

  stack.value = [
    ...stack.value,
    {
      id: ++counter,
      options: { ...options, component: markRaw(options.component) },
      complete: resolve as ModalInstance['complete'],
      isDesktop: window.innerWidth >= 1200
    }
  ];

  return promise;
}

function dismiss(data: unknown = null, role = 'dismiss') {
  const top = stack.value.at(-1);
  if (top) dismissInstance(top, data, role);
}

function dismissAll() {
  const current = [...stack.value];
  stack.value = [];

  current.toReversed().forEach(instance => {
    instance.options.onWillDismiss?.();
    instance.complete({ data: null, role: 'dismiss-all' });
    instance.options.onDidDismiss?.();
  });
}

export function useModal() {
  return {
    modalStack: readonly(stack),
    showModal,
    dismiss,
    dismissAll
  } as const;
}

export { dismiss, dismissAll, showModal };
