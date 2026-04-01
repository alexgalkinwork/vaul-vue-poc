<template>
  <button
    v-if="showClose"
    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
    @click="dismiss(null, 'close-button')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue';
  import { MODAL_DISMISSIBLE_KEY, dismiss } from './useModal';

  const dismissible = inject(MODAL_DISMISSIBLE_KEY, true);
  const showClose = computed(() => dismissible !== false);
</script>
