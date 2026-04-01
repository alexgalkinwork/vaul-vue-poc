<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader :title="title" />
    </template>

    <div class="space-y-4 p-4">
      <p class="text-gray-600">{{ message }}</p>
    </div>

    <template #footer>
      <div class="flex gap-3 p-4">
        <button
          class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
          @click="dismiss(null, 'cancel')">
          Cancel
        </button>
        <button
          class="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white active:bg-red-700"
          @click="dismiss({ confirmed: true }, 'confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const {
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Confirm'
  } = defineProps<{
    title?: string;
    message?: string;
    confirmLabel?: string;
  }>();
</script>
