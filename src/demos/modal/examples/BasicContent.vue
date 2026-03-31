<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader :title="title" />
    </template>

    <div class="p-4 space-y-4">
      <p class="text-gray-600">
        This is a basic modal. On mobile it renders as a bottom sheet, on
        desktop (≥1200px) as a centered dialog.
      </p>
      <p class="text-gray-600">
        Try dismissing via backdrop click, Escape key, or the close button.
      </p>
      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700"
        @click="dismiss(null, 'close')"
      >
        Close
      </button>
    </div>
  </ModalTemplate>
</template>

<script setup lang="ts">
import ModalTemplate from "../ModalTemplate.vue";
import ModalHeader from "../ModalHeader.vue";
import { dismiss } from "../useModal";

const { title = "Basic Modal" } = defineProps<{
  title?: string;
}>();
</script>
