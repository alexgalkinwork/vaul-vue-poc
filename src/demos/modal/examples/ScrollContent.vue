<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Scrollable Content" />
    </template>

    <div class="space-y-3 p-4">
      <p class="text-sm text-gray-500">
        Scroll down to see the header/footer shadow indicators appear. These
        show when content is scrollable.
      </p>

      <div
        v-for="i in 15"
        :key="i"
        class="rounded-lg bg-gray-50 p-3">
        <p class="text-sm font-medium text-gray-700">Section {{ i }}</p>
        <p class="text-sm text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="p-4">
        <button
          class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
          @click="dismiss(null, 'close')">
          Done
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';
</script>
