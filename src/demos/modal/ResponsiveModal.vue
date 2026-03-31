<template>
  <template v-for="(instance, index) in modalStack" :key="instance.id">
    <!-- Desktop: Reka UI Dialog -->
    <DialogRoot
      v-if="instance.isDesktop"
      :open="true"
      :modal="true"
      @update:open="
        (val: boolean) => {
          if (!val) handleDialogDismiss(instance);
        }
      "
    >
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0"
          :class="index === 0 ? 'bg-black/30' : ''"
          :style="{ zIndex: 100 + index * 10 }"
        />
        <DialogContent
          class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl flex flex-col"
          :class="[
            sizeClasses[instance.options.size ?? 'medium'],
            index > 0 ? 'shadow-[0_28px_48px_rgba(0,0,0,0.4)]' : 'shadow-xl',
            instance.options.autoHeight ? 'max-h-dvh' : 'max-h-[85vh]',
          ]"
          :style="{ zIndex: 101 + index * 10 }"
          @escape-key-down="() => setDialogDismissReason('escape')"
          @pointer-down-outside="
            (event: any) => handlePointerDownOutside(event)
          "
          @open-auto-focus="() => instance.options.onPresent?.()"
        >
          <DialogTitle class="sr-only">Modal</DialogTitle>
          <DialogDescription class="sr-only">Modal content</DialogDescription>
          <component
            :is="instance.options.component"
            v-bind="instance.options.componentProps ?? {}"
          />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <!-- Mobile: vaul-vue Sheet -->
    <DrawerRoot
      v-else
      :open="true"
      :dismissible="!instance.options.preventSwipeDismiss && instance.options.showHandle !== false"
      @update:open="
        (val: boolean) => {
          if (!val) handleSheetDismiss(instance);
        }
      "
      @animation-end="
        (open: boolean) => {
          if (open) instance.options.onPresent?.();
        }
      "
    >
      <DrawerPortal>
        <DrawerOverlay
          class="fixed inset-0"
          :class="index === 0 ? 'bg-black/30' : ''"
          :style="{ zIndex: 100 + index * 10 }"
          @pointerdown="() => setSheetDismissReason('backdrop')"
        />
        <DrawerContent
          class="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white"
          :class="instance.options.autoHeight ? '' : 'max-h-[96dvh]'"
          :style="{ zIndex: 101 + index * 10 }"
          @keydown.escape="() => setSheetDismissReason('escape')"
        >
          <DrawerTitle class="sr-only">Modal</DrawerTitle>
          <DrawerDescription class="sr-only">Modal content</DrawerDescription>
          <div
            v-if="instance.options.showHandle !== false"
            class="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300 shrink-0"
          />
          <component
            :is="instance.options.component"
            v-bind="instance.options.componentProps ?? {}"
          />
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </template>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "reka-ui";
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "vaul-vue";
import {
  useModal,
  checkCanDismiss,
  dismissInstance,
  type ModalInstance,
  type ModalSize,
  type DismissReason,
} from "./useModal";

const { modalStack } = useModal();

const sizeClasses: Record<ModalSize, string> = {
  small: "w-[438px]",
  medium: "w-[672px]",
  large: "w-[1140px]",
};

// --- Dialog mode handlers ---

let dialogDismissReason: DismissReason = "backdrop";

function setDialogDismissReason(reason: DismissReason) {
  dialogDismissReason = reason;
}

function handlePointerDownOutside(event: any) {
  // Scrollbar click prevention — always block these
  const orig = event.detail?.originalEvent;
  if (orig) {
    const target = orig.target as HTMLElement;
    if (
      orig.offsetX > target.clientWidth ||
      orig.offsetY > target.clientHeight
    ) {
      event.preventDefault();
      return;
    }
  }
  dialogDismissReason = "backdrop";
}

function handleDialogDismiss(instance: ModalInstance) {
  const reason = dialogDismissReason;
  dialogDismissReason = "backdrop";

  if (checkCanDismiss(instance, reason)) {
    dismissInstance(instance, null, reason);
  }
}

// --- Sheet mode handlers ---

let sheetDismissReason: DismissReason = "swipe";

function setSheetDismissReason(reason: DismissReason) {
  sheetDismissReason = reason;
}

function handleSheetDismiss(instance: ModalInstance) {
  const reason = sheetDismissReason;
  sheetDismissReason = "swipe";

  if (checkCanDismiss(instance, reason)) {
    dismissInstance(instance, null, reason);
  }
}
</script>
