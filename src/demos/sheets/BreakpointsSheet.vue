<template>
  <DrawerRoot
    :open="open"
    :snap-points="[0.25, 0.5, 1]"
    :active-snap-point="activeSnap"
    @update:open="onOpenChange"
    @update:active-snap-point="
      (v: string | number) => (activeSnap = Number(v))
    ">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent
        class="fixed right-0 bottom-0 left-0 flex h-[96dvh] flex-col rounded-t-2xl bg-white">
        <div
          class="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
        <div class="flex shrink-0 items-center justify-between px-4 pt-2 pb-2">
          <DrawerTitle class="text-lg font-semibold"> Breakpoints </DrawerTitle>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
            @click="open = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <DrawerDescription class="sr-only"> Sheet content </DrawerDescription>
        <div class="flex-1 space-y-4 overflow-y-auto p-4">
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
            class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
            @click="open = false">
            Close
          </button>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
  import {
    DrawerContent,
    DrawerDescription,
    DrawerOverlay,
    DrawerPortal,
    DrawerRoot,
    DrawerTitle
  } from '../../lib/vaul-vue';
  import { ref } from 'vue';

  const emit = defineEmits<{ close: [result?: string] }>();
  const open = ref(true);
  const activeSnap = ref<number>(0.5);

  function onOpenChange(val: boolean) {
    if (!val) emit('close', 'dismiss');
    open.value = val;
  }
</script>
