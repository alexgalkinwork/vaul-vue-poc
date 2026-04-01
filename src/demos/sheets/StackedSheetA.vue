<template>
  <DrawerRoot
    :open="open"
    :snap-points="[0.6, 1]"
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
          <DrawerTitle class="text-lg font-semibold">
            Stacked (Layer 1)
          </DrawerTitle>
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
            This is the first sheet. Open a second one on top of it.
          </p>
          <button
            class="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white active:bg-purple-700"
            @click="showSecond = true">
            Open Second Sheet
          </button>
          <button
            class="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
            @click="open = false">
            Close This Sheet
          </button>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>

  <StackedSheetB
    v-if="showSecond"
    @close="showSecond = false" />
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
  import StackedSheetB from './StackedSheetB.vue';

  const emit = defineEmits<{ close: [result?: string] }>();
  const open = ref(true);
  const showSecond = ref(false);
  const activeSnap = ref<number>(0.6);

  function onOpenChange(val: boolean) {
    if (!val) emit('close', 'dismiss');
    open.value = val;
  }
</script>
