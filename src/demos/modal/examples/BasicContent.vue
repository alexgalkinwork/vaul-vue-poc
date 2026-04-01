<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader :title="title" />
    </template>

    <div class="space-y-4 p-4">
      <p class="text-gray-600">
        This is a basic modal. On mobile it renders as a bottom sheet, on
        desktop (≥1200px) as a centered dialog.
      </p>
      <p class="text-gray-600">
        Try dismissing via backdrop click, Escape key, or the close button.
      </p>
      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
        @click="dismiss(null, 'close')">
        Close
      </button>
    </div>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const { title = 'Basic Modal' } = defineProps<{
    title?: string;
  }>();
</script>
