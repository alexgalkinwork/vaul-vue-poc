<template>
  <div class="flex items-center px-4 pt-3 pb-2">
    <button
      v-if="backButton"
      class="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 mr-2"
      @click="$emit('back')"
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
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
    <h2 class="text-lg font-semibold flex-1">{{ title }}</h2>
    <button
      v-if="closeButton"
      class="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 flex items-center justify-center shrink-0"
      @click="dismiss(null, 'close-button')"
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
</template>

<script setup lang="ts">
import { dismiss } from "./useModal";

const { closeButton = true, backButton = false } = defineProps<{
  title: string;
  closeButton?: boolean;
  backButton?: boolean;
}>();

defineEmits<{ back: [] }>();
</script>
