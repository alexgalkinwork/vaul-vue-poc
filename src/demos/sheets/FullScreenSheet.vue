<template>
  <DrawerRoot
    :open="open"
    :dismissible="false"
    @update:open="onOpenChange">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent
        class="fixed right-0 bottom-0 left-0 flex h-dvh flex-col bg-white">
        <div class="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
          <DrawerTitle class="text-lg font-semibold"> Full Screen </DrawerTitle>
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
        <div class="flex flex-1 items-center justify-center p-4">
          <p class="text-center text-gray-500">
            This sheet takes the entire viewport.<br />No drag handle, no
            rounded corners.
          </p>
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
  } from 'vaul-vue';
  import { ref } from 'vue';

  const emit = defineEmits<{ close: [result?: string] }>();
  const open = ref(true);

  function onOpenChange(val: boolean) {
    if (!val) emit('close', 'dismiss');
    open.value = val;
  }
</script>
