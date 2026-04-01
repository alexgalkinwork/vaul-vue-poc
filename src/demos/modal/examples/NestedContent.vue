<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader :title="`Nested Modal (Layer ${depth})`" />
    </template>

    <div class="space-y-4 p-4">
      <p class="text-gray-600">
        This is layer {{ depth }} ({{ size }}) of the modal stack. Open another
        modal with a different size on top.
      </p>

      <div class="rounded-lg bg-purple-50 p-3">
        <p class="text-sm text-purple-800">
          Stack depth: {{ depth }}. Each nested modal gets a higher z-index
          automatically.
        </p>
      </div>

      <div class="space-y-2">
        <button
          v-for="s in nextSizes"
          :key="s"
          class="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white active:bg-purple-700"
          @click="openAnother(s)">
          Open {{ s }} modal on top
        </button>
      </div>

      <button
        v-if="depth > 1"
        class="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white active:bg-red-700"
        @click="dismissAll">
        Dismiss All ({{ depth }} modals)
      </button>

      <button
        class="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
        @click="dismiss(null, 'close')">
        Close This Modal
      </button>
    </div>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss, dismissAll, showModal, type ModalSize } from '../useModal';
  import NestedContent from './NestedContent.vue';

  const { depth = 1, size = 'large' } = defineProps<{
    depth?: number;
    size?: ModalSize;
  }>();

  const allSizes: ModalSize[] = ['small', 'medium', 'large'];

  const nextSizes = computed(() => allSizes.filter(s => s !== size));

  function openAnother(nextSize: ModalSize) {
    showModal({
      component: NestedContent,
      componentProps: { depth: depth + 1, size: nextSize },
      size: nextSize
    });
  }
</script>
