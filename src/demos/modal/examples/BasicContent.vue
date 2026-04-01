<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader :title="title" />
    </template>

    <div class="space-y-4 p-4">
      <p class="text-gray-600">
        Dieses Modal rendert auf Mobile (&lt;1200px) als Bottom Sheet und auf
        Desktop (≥1200px) als zentrierten Dialog.
      </p>

      <div class="rounded-lg bg-blue-50 p-3">
        <p class="text-sm font-medium text-blue-800">Dismiss-Methoden</p>
        <ul class="mt-1 list-inside list-disc text-sm text-blue-700">
          <li>Backdrop anklicken</li>
          <li>Escape-Taste</li>
          <li>Close-Button oben rechts</li>
          <li>Button unten</li>
        </ul>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <p class="text-sm font-medium text-gray-700">Technische Details</p>
        <div class="mt-1 space-y-1 text-sm text-gray-600">
          <p>
            <span class="font-medium">Modus:</span>
            {{ isDesktop ? 'Dialog (Reka UI)' : 'Sheet (vaul-vue)' }}
          </p>
          <p>
            <span class="font-medium">Viewport:</span>
            {{ viewportWidth }}px
          </p>
        </div>
      </div>

      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
        @click="dismiss(null, 'close')">
        Schließen
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

  const viewportWidth = window.innerWidth;
  const isDesktop = viewportWidth >= 1200;
</script>
