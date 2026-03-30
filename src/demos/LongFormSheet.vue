<template>
  <DrawerRoot :open="open" @update:open="onOpenChange">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent
        class="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white max-h-[96dvh]"
      >
        <div
          class="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300 shrink-0"
        />
        <div class="flex items-center justify-between px-4 pt-2 pb-2 shrink-0">
          <DrawerTitle class="text-lg font-semibold"> Long Form </DrawerTitle>
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
          <p class="text-sm text-gray-500">
            This form has 12 fields. Scroll down and tap any input — it should
            scroll into view above the keyboard.
          </p>

          <div class="space-y-3">
            <div v-for="(field, index) in fields" :key="index">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                field.label
              }}</label>
              <input
                v-model="field.value"
                type="text"
                :placeholder="`Enter ${field.label.toLowerCase()}`"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="flex gap-3 pb-4">
            <button
              class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
              @click="open = false"
            >
              Cancel
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700"
              @click="open = false"
            >
              Save All
            </button>
          </div>
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

const fields = ref(
  Array.from({ length: 12 }, (_, i) => ({
    label: `Field ${i + 1}`,
    value: "",
  })),
);

function onOpenChange(val: boolean) {
  if (!val) emit("close", "dismiss");
  open.value = val;
}
</script>
