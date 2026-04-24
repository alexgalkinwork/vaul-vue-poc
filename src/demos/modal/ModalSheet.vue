<template>
  <DrawerRoot
    :open="isOpen"
    :dismissible="swipeable"
    @update:open="onOpenChange"
    @animation-end="onAnimationEnd">
    <DrawerPortal>
      <DrawerOverlay
        class="fixed inset-0"
        :class="firstInStack ? 'bg-black/30' : ''"
        :style="{ zIndex }"
        @pointerdown="pendingReason = 'backdrop'" />
      <DrawerContent
        class="fixed right-0 bottom-0 left-0 flex flex-col rounded-t-2xl bg-white"
        :class="instance.options.autoHeight ? '' : 'max-h-[96dvh]'"
        :style="{ zIndex: zIndex + 1 }"
        @keydown.escape="pendingReason = 'escape'">
        <DrawerTitle class="sr-only">Modal</DrawerTitle>
        <DrawerDescription class="sr-only">Modal content</DrawerDescription>
        <div
          v-if="swipeable"
          class="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
        <component
          :is="instance.options.component"
          v-bind="instance.options.componentProps ?? {}" />
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
  import {
    DrawerContent,
    DrawerDescription,
    DrawerOverlay,
    DrawerPortal,
    DrawerRoot,
    DrawerTitle
  } from '../../lib/vaul-vue';
  import {
    MODAL_DISMISSIBLE_KEY,
    checkCanDismiss,
    dismissInstance,
    type DismissReason,
    type ModalInstance
  } from './useModal';

  const { instance, zIndex, firstInStack } = defineProps<{
    instance: ModalInstance;
    zIndex: number;
    firstInStack: boolean;
  }>();

  provide(MODAL_DISMISSIBLE_KEY, instance.options.dismissible ?? true);

  onMounted(() => {
    document.documentElement.classList.add('drawer-open');
  });
  onUnmounted(() => {
    setTimeout(() => {
      if (!document.querySelector('[data-vaul-drawer]')) {
        document.documentElement.classList.remove('drawer-open');
      }
    }, 500);
  });

  const swipeable = computed(
    () => (instance.options.dismissible ?? true) === true
  );

  const isOpen = ref(true);
  const pendingReason = ref<DismissReason>('swipe');

  // Hook into onWillDismiss to trigger close animation before stack removal
  const originalOnWillDismiss = instance.options.onWillDismiss;
  instance.options.onWillDismiss = () => {
    isOpen.value = false;
    originalOnWillDismiss?.();
  };

  function onOpenChange(open: boolean) {
    if (open) return;
    const reason = pendingReason.value;
    pendingReason.value = 'swipe';
    if (checkCanDismiss(instance, reason)) {
      dismissInstance(instance, null, reason);
    }
  }

  function onAnimationEnd(open: boolean) {
    if (open) instance.options.onPresent?.();
  }
</script>
