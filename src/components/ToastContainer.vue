<template>
  <ToastProvider
    v-for="pos in positions"
    :key="pos"
    :duration="10000"
    swipe-direction="right"
  >
    <ToastRoot
      v-if="getByPosition(pos)"
      :key="getByPosition(pos)!.id"
      :duration="getByPosition(pos)!.duration"
      :open="true"
      class="w-80 rounded-lg border-l-4 bg-white shadow-lg p-4 flex gap-3 items-start pointer-events-auto"
      :class="borderColors[getByPosition(pos)!.type]"
      @pointerdown.stop
      @pointerup.stop
      @click.stop
      @update:open="(val: boolean) => handleToastOpenChange(val, pos)"
    >
      <div class="flex-1 min-w-0">
        <ToastTitle
          v-if="getByPosition(pos)!.title"
          class="font-semibold text-sm text-gray-900 mb-1"
        >
          {{ getByPosition(pos)!.title }}
        </ToastTitle>
        <ToastDescription
          class="text-sm text-gray-700"
          v-html="getByPosition(pos)!.message"
        />
        <ToastAction
          v-if="getByPosition(pos)!.action"
          :alt-text="getByPosition(pos)!.action!.label"
          as-child
        >
          <button
            class="mt-2 text-sm font-medium underline"
            :class="actionColors[getByPosition(pos)!.type]"
            @click="getByPosition(pos)!.action!.onClick()"
          >
            {{ getByPosition(pos)!.action!.label }}
          </button>
        </ToastAction>
      </div>
      <ToastClose
        class="shrink-0 h-6 w-6 rounded hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </ToastClose>
    </ToastRoot>

    <ToastPortal>
      <ToastViewport
        class="fixed z-110 flex flex-col gap-2 w-80 m-0 p-0 list-none outline-none pointer-events-none"
        :class="positionClasses[pos]"
      />
    </ToastPortal>
  </ToastProvider>
</template>

<script setup lang="ts">
import {
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
  ToastPortal,
} from "reka-ui";
import {
  useToast,
  type ToastPosition,
  type ToastType,
} from "../composables/useToast";

const { getByPosition, dismiss } = useToast();

const positions: ToastPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

// Reka UI emits update:open for both open and close. We only care about close
function handleToastOpenChange(open: boolean, pos: ToastPosition) {
  if (!open) {
    dismiss(pos);
  }
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

const borderColors: Record<ToastType, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  warning: "border-l-yellow-500",
  info: "border-l-blue-500",
};

const actionColors: Record<ToastType, string> = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};
</script>
