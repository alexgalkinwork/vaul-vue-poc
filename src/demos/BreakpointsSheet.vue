<template>
  <DrawerRoot
    :open="open"
    :snap-points="[0.25, 0.5, 1]"
    :active-snap-point="activeSnap"
    @update:open="onOpenChange"
    @update:active-snap-point="(v: string | number) => (activeSnap = Number(v))"
  >
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent
        class="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white h-[96dvh]"
      >
        <div
          class="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300 shrink-0"
        />
        <div class="flex items-center justify-between px-4 pt-2 pb-2 shrink-0">
          <DrawerTitle class="text-lg font-semibold"> Breakpoints </DrawerTitle>
          <button
            class="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 flex items-center justify-center"
            @click="open = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          </button>
        </div>
        <DrawerDescription class="sr-only"> Sheet content </DrawerDescription>
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <p class="text-gray-600">
            This sheet has three snap points: 25%, 50%, and 100%. Drag the
            handle to move between them.
          </p>
          <div class="rounded-lg bg-blue-50 p-3">
            <p class="text-sm text-blue-800">
              Try dragging the sheet up and down. It should snap to 25%, 50%, or
              100% of the screen height.
            </p>
          </div>
          <div class="rounded-lg bg-amber-50 p-3">
            <p class="text-sm text-amber-800">
              Swiping below the lowest snap point should dismiss the sheet.
            </p>
          </div>
          <button
            class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700"
            @click="open = false"
          >
            Close
          </button>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "vaul-vue";

const emit = defineEmits<{ close: [result?: string] }>();
const open = ref(true);
const activeSnap = ref<number>(0.5);

function onOpenChange(val: boolean) {
  if (!val) emit("close", "dismiss");
  open.value = val;
}
</script>
