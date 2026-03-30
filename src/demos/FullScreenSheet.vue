<template>
  <DrawerRoot :open="open" :dismissible="false" @update:open="onOpenChange">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent
        class="fixed bottom-0 left-0 right-0 flex flex-col bg-white h-dvh"
      >
        <div class="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <DrawerTitle class="text-lg font-semibold"> Full Screen </DrawerTitle>
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
        <div class="flex-1 flex items-center justify-center p-4">
          <p class="text-gray-500 text-center">
            This sheet takes the entire viewport.<br />No drag handle, no
            rounded corners.
          </p>
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

function onOpenChange(val: boolean) {
  if (!val) emit("close", "dismiss");
  open.value = val;
}
</script>
