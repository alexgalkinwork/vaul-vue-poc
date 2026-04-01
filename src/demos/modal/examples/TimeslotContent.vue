<template>
  <ModalTemplate>
    <template #header>
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Lieferzeit wählen</h2>
        <p class="text-xs text-gray-500">Dienstag, 1. April 2026</p>
      </div>
    </template>

    <div class="space-y-2 p-4">
      <button
        v-for="slot in timeslots"
        :key="slot.id"
        class="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors"
        :class="
          selected === slot.id
            ? 'border-blue-500 bg-blue-50'
            : slot.available
              ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              : 'cursor-not-allowed border-gray-100 opacity-50'
        "
        :disabled="!slot.available"
        @click="selected = slot.id">
        <div>
          <p
            class="text-sm font-medium"
            :class="selected === slot.id ? 'text-blue-900' : 'text-gray-900'">
            {{ slot.label }}
          </p>
          <p class="text-xs text-gray-500">{{ slot.description }}</p>
        </div>
        <div class="text-right">
          <p
            class="text-sm font-semibold"
            :class="
              slot.price === 0
                ? 'text-green-600'
                : selected === slot.id
                  ? 'text-blue-700'
                  : 'text-gray-700'
            ">
            {{ slot.price === 0 ? 'Kostenlos' : `€ ${slot.price.toFixed(2)}` }}
          </p>
          <p
            v-if="!slot.available"
            class="text-xs text-red-500">
            Ausgebucht
          </p>
        </div>
      </button>
    </div>

    <template #footer>
      <div class="p-4">
        <button
          class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
          :disabled="!selected"
          :class="{ 'opacity-50': !selected }"
          @click="confirm">
          {{ selectedSlot ? `${selectedSlot.label} bestätigen` : 'Zeitfenster wählen' }}
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const timeslots = [
    {
      id: 'express',
      label: 'Express (30 Min)',
      description: 'Schnellstmögliche Lieferung',
      price: 4.99,
      available: true
    },
    {
      id: 'morning',
      label: '08:00 – 12:00',
      description: 'Vormittags',
      price: 1.99,
      available: false
    },
    {
      id: 'afternoon',
      label: '12:00 – 17:00',
      description: 'Nachmittags',
      price: 1.99,
      available: true
    },
    {
      id: 'evening',
      label: '17:00 – 21:00',
      description: 'Abends',
      price: 0,
      available: true
    },
    {
      id: 'night',
      label: '21:00 – 23:00',
      description: 'Spätabends',
      price: 2.99,
      available: true
    }
  ];

  const selected = ref<string>();

  const selectedSlot = computed(() =>
    timeslots.find(s => s.id === selected.value)
  );

  function confirm() {
    if (!selectedSlot.value) return;
    dismiss(selectedSlot.value, 'success');
  }
</script>
