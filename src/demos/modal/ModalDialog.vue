<template>
  <DialogRoot
    :open="true"
    :modal="true">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0"
        :class="firstInStack ? 'bg-black/30' : ''"
        :style="{ zIndex }" />
      <DialogContent
        class="fixed top-1/2 left-1/2 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white"
        :class="[
          sizeClasses[instance.options.size ?? 'medium'],
          firstInStack ? 'shadow-xl' : 'shadow-[0_28px_48px_rgba(0,0,0,0.4)]',
          instance.options.autoHeight ? 'max-h-dvh' : 'max-h-[85vh]'
        ]"
        :style="{ zIndex: zIndex + 1 }"
        @escape-key-down.prevent="tryDismiss('escape')"
        @pointer-down-outside.prevent="tryDismiss('backdrop')"
        @interact-outside.prevent
        @open-auto-focus="() => instance.options.onPresent?.()">
        <DialogTitle class="sr-only">Modal</DialogTitle>
        <DialogDescription class="sr-only">Modal content</DialogDescription>
        <component
          :is="instance.options.component"
          v-bind="instance.options.componentProps ?? {}" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
  import { provide } from 'vue';
  import {
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle
  } from 'reka-ui';
  import {
    MODAL_DISMISSIBLE_KEY,
    checkCanDismiss,
    dismissInstance,
    type DismissReason,
    type ModalInstance,
    type ModalSize
  } from './useModal';

  const { instance, zIndex, firstInStack } = defineProps<{
    instance: ModalInstance;
    zIndex: number;
    firstInStack: boolean;
  }>();

  provide(MODAL_DISMISSIBLE_KEY, instance.options.dismissible ?? true);

  const sizeClasses = {
    small: 'w-[438px]',
    medium: 'w-[672px]',
    large: 'w-[1140px]'
  } satisfies Record<ModalSize, string>;

  function tryDismiss(reason: DismissReason) {
    if (checkCanDismiss(instance, reason)) {
      dismissInstance(instance, null, reason);
    }
  }
</script>
