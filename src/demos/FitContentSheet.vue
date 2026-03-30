<template>
  <DrawerRoot
    :open="open"
    @update:open="onOpenChange"
  >
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent class="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white">
        <div class="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300 shrink-0" />
        <div class="flex items-center justify-between px-4 pt-2 pb-2 shrink-0">
          <DrawerTitle class="text-lg font-semibold">
            Fit Content
          </DrawerTitle>
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
            ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
        <DrawerDescription class="sr-only">
          Sheet content
        </DrawerDescription>
        <div class="p-4 space-y-4">
          <p class="text-gray-600">
            This sheet should only be as tall as its content — no extra space.
          </p>
          <button
            class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700"
            @click="open = false"
          >
            Got it
          </button>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DrawerRoot, DrawerPortal, DrawerOverlay, DrawerContent,
  DrawerTitle, DrawerDescription,
} from 'vaul-vue'

const emit = defineEmits<{ close: [result?: string] }>()
const open = ref(true)

function onOpenChange(val: boolean) {
  if (!val) emit('close', 'dismiss')
  open.value = val
}
</script>
