<template>
  <template
    v-for="(instance, index) in modalStack"
    :key="instance.id">
    <!-- Desktop: Reka UI Dialog -->
    <DialogRoot
      v-if="instance.isDesktop"
      :open="true"
      :modal="true">
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0"
          :class="index === 0 ? 'bg-black/30' : ''"
          :style="{ zIndex: 100 + index * 10 }" />
        <DialogContent
          class="fixed top-1/2 left-1/2 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white"
          :class="[
            sizeClasses[instance.options.size ?? 'medium'],
            index > 0 ? 'shadow-[0_28px_48px_rgba(0,0,0,0.4)]' : 'shadow-xl',
            instance.options.autoHeight ? 'max-h-dvh' : 'max-h-[85vh]'
          ]"
          :style="{ zIndex: 101 + index * 10 }"
          @escape-key-down="
            (e: KeyboardEvent) => handleDialogEvent(e, instance, 'escape')
          "
          @pointer-down-outside="
            (e: any) => handlePointerDownOutside(e, instance)
          "
          @interact-outside="(e: any) => e.preventDefault()"
          @open-auto-focus="() => instance.options.onPresent?.()">
          <DialogTitle class="sr-only">Modal</DialogTitle>
          <DialogDescription class="sr-only">Modal content</DialogDescription>
          <ModalDismissibleProvider :dismissible="instance.options.dismissible ?? true">
            <component
              :is="instance.options.component"
              v-bind="instance.options.componentProps ?? {}" />
          </ModalDismissibleProvider>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <!-- Mobile: vaul-vue Sheet -->
    <DrawerRoot
      v-else
      :open="true"
      :dismissible="isDismissibleSwipe(instance)"
      @update:open="
        (val: boolean) => {
          if (!val) handleSheetDismiss(instance);
        }
      "
      @animation-end="
        (open: boolean) => {
          if (open) instance.options.onPresent?.();
        }
      ">
      <DrawerPortal>
        <DrawerOverlay
          class="fixed inset-0"
          :class="index === 0 ? 'bg-black/30' : ''"
          :style="{ zIndex: 100 + index * 10 }"
          @pointerdown="() => setSheetDismissReason('backdrop')" />
        <DrawerContent
          class="fixed right-0 bottom-0 left-0 flex flex-col rounded-t-2xl bg-white"
          :class="instance.options.autoHeight ? '' : 'max-h-[96dvh]'"
          :style="{ zIndex: 101 + index * 10 }"
          @keydown.escape="() => setSheetDismissReason('escape')">
          <DrawerTitle class="sr-only">Modal</DrawerTitle>
          <DrawerDescription class="sr-only">Modal content</DrawerDescription>
          <div
            v-if="showHandle(instance)"
            class="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
          <ModalDismissibleProvider :dismissible="instance.options.dismissible ?? true">
            <component
              :is="instance.options.component"
              v-bind="instance.options.componentProps ?? {}" />
          </ModalDismissibleProvider>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </template>
</template>

<script setup lang="ts">
  import { defineComponent, provide } from 'vue';
  import {
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle
  } from 'reka-ui';
  import {
    DrawerContent,
    DrawerDescription,
    DrawerOverlay,
    DrawerPortal,
    DrawerRoot,
    DrawerTitle
  } from 'vaul-vue';
  import {
    MODAL_DISMISSIBLE_KEY,
    checkCanDismiss,
    dismissInstance,
    useModal,
    type Dismissible,
    type DismissReason,
    type ModalInstance,
    type ModalSize
  } from './useModal';

  const ModalDismissibleProvider = defineComponent({
    props: {
      dismissible: {
        type: [Boolean, String],
        required: true
      }
    },
    setup(props, { slots }) {
      provide(MODAL_DISMISSIBLE_KEY, props.dismissible as Dismissible);
      return () => slots.default?.();
    }
  });

  const { modalStack } = useModal();

  const sizeClasses = {
    small: 'w-[438px]',
    medium: 'w-[672px]',
    large: 'w-[1140px]'
  } satisfies Record<ModalSize, string>;

  function showHandle(instance: ModalInstance): boolean {
    return (instance.options.dismissible ?? true) === true;
  }

  function isDismissibleSwipe(instance: ModalInstance): boolean {
    return (instance.options.dismissible ?? true) === true;
  }

  // --- Dialog: prevent all events, dismiss manually ---

  function handleDialogEvent(
    event: Event,
    instance: ModalInstance,
    reason: DismissReason
  ) {
    event.preventDefault();
    if (checkCanDismiss(instance, reason)) {
      dismissInstance(instance, null, reason);
    }
  }

  function handlePointerDownOutside(event: any, instance: ModalInstance) {
    event.preventDefault();
    const orig = event.detail?.originalEvent as PointerEvent | undefined;
    if (orig) {
      const target = orig.target as HTMLElement;
      if (
        orig.offsetX > target.clientWidth ||
        orig.offsetY > target.clientHeight
      ) {
        return;
      }
    }
    if (checkCanDismiss(instance, 'backdrop')) {
      dismissInstance(instance, null, 'backdrop');
    }
  }

  // --- Sheet: track reason via events, dismiss on update:open ---

  let sheetDismissReason: DismissReason = 'swipe';

  function setSheetDismissReason(reason: DismissReason) {
    sheetDismissReason = reason;
  }

  function handleSheetDismiss(instance: ModalInstance) {
    const reason = sheetDismissReason;
    sheetDismissReason = 'swipe';
    if (checkCanDismiss(instance, reason)) {
      dismissInstance(instance, null, reason);
    }
  }
</script>
