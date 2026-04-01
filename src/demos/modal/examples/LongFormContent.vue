<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Registrierung" />
    </template>

    <div class="space-y-3 p-4">
      <p class="text-sm text-gray-500">
        12 Felder — testet Scroll-Verhalten und Keyboard-Handling bei vielen
        Inputs.
      </p>

      <div
        v-for="field in fields"
        :key="field.label">
        <label class="mb-1 block text-sm font-medium text-gray-700">
          {{ field.label }}
        </label>
        <input
          v-model="field.value"
          type="text"
          :placeholder="field.placeholder"
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 p-4">
        <button
          class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
          @click="dismiss(null, 'cancel')">
          Abbrechen
        </button>
        <button
          class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
          @click="submit">
          Alle speichern
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const fields = reactive([
    { label: 'Vorname', value: '', placeholder: 'Max' },
    { label: 'Nachname', value: '', placeholder: 'Mustermann' },
    { label: 'E-Mail', value: '', placeholder: 'max@beispiel.de' },
    { label: 'Telefon', value: '', placeholder: '+49 123 456789' },
    { label: 'Straße', value: '', placeholder: 'Musterstraße 42' },
    { label: 'PLZ', value: '', placeholder: '10115' },
    { label: 'Stadt', value: '', placeholder: 'Berlin' },
    { label: 'Land', value: '', placeholder: 'Deutschland' },
    { label: 'Geburtsdatum', value: '', placeholder: '01.01.1990' },
    { label: 'Firma', value: '', placeholder: 'Muster GmbH' },
    { label: 'Position', value: '', placeholder: 'Entwickler' },
    { label: 'Anmerkungen', value: '', placeholder: 'Optional...' }
  ]);

  function submit() {
    const data = Object.fromEntries(
      fields.map(f => [f.label, f.value])
    );
    dismiss(data, 'success');
  }
</script>
