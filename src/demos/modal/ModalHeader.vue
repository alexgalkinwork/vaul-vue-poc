<template>
  <div class="flex items-center px-4 pt-3 pb-2">
    <button
      v-if="backButton"
      class="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
      @click="$emit('back')">
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
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
    <h2 class="flex-1 text-lg font-semibold">{{ title }}</h2>
    <button
      v-if="showClose"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
      @click="dismiss(null, 'close-button')">
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
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue';
  import { MODAL_DISMISSIBLE_KEY, dismiss } from './useModal';

  const { backButton = false } = defineProps<{
    title: string;
    backButton?: boolean;
  }>();

  defineEmits<{ back: [] }>();

  const dismissible = inject(MODAL_DISMISSIBLE_KEY, true);
  const showClose = computed(() => dismissible !== false);
</script>
