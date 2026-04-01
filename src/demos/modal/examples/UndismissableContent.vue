<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Processing..." />
    </template>

    <div class="space-y-4 p-4">
      <p class="text-gray-600">
        This modal cannot be dismissed by the user. No close button, no Escape,
        no backdrop click, no swipe. It simulates a blocking operation.
      </p>

      <div class="rounded-lg bg-amber-50 p-3">
        <p class="text-sm text-amber-800">
          The modal will auto-close after 3 seconds (simulating an async
          operation completing).
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span class="text-sm text-gray-600"
          >Please wait... ({{ remaining }}s)</span
        >
      </div>
    </div>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const remaining = ref(3);
  let interval: ReturnType<typeof setInterval>;

  onMounted(() => {
    interval = setInterval(() => {
      remaining.value--;
      if (remaining.value <= 0) {
        clearInterval(interval);
        dismiss({ completed: true }, 'success');
      }
    }, 1000);
  });

  onUnmounted(() => clearInterval(interval));
</script>
