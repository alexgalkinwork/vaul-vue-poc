import {
  type Component,
  type ComputedRef,
  type InjectionKey,
  type ShallowRef,
  computed,
  inject,
  markRaw,
  shallowRef
} from 'vue';

export interface NavEntry {
  component: Component;
  title: string;
  props?: Record<string, unknown>;
}

export interface NavStack {
  stack: Readonly<ShallowRef<NavEntry[]>>;
  activeEntry: ComputedRef<NavEntry>;
  canGoBack: ComputedRef<boolean>;
  currentTitle: ComputedRef<string>;
  direction: ShallowRef<'forward' | 'back'>;
  push: (
    component: Component,
    options: { title: string; props?: Record<string, unknown> }
  ) => void;
  pop: () => void;
  popToRoot: () => void;
}

export const NAV_STACK_KEY: InjectionKey<NavStack> = Symbol('nav-stack');

export function createNavStack(
  rootComponent: Component,
  rootTitle: string
): NavStack {
  const stack = shallowRef<NavEntry[]>([
    { component: markRaw(rootComponent), title: rootTitle }
  ]);

  const direction = shallowRef<'forward' | 'back'>('forward');
  const activeEntry = computed(() => stack.value.at(-1)!);
  const canGoBack = computed(() => stack.value.length > 1);
  const currentTitle = computed(() => activeEntry.value.title);

  function push(
    component: Component,
    { title, props }: { title: string; props?: Record<string, unknown> }
  ) {
    direction.value = 'forward';
    stack.value = [
      ...stack.value,
      { component: markRaw(component), title, props }
    ];
  }

  function pop() {
    if (!canGoBack.value) return;
    direction.value = 'back';
    stack.value = stack.value.slice(0, -1);
  }

  function popToRoot() {
    if (!canGoBack.value) return;
    direction.value = 'back';
    stack.value = [stack.value[0]];
  }

  return {
    stack,
    activeEntry,
    canGoBack,
    currentTitle,
    direction,
    push,
    pop,
    popToRoot
  };
}

export function useNavStack(): NavStack {
  const nav = inject(NAV_STACK_KEY);
  if (!nav) throw new Error('useNavStack() must be used inside ModalNavStack');
  return nav;
}
