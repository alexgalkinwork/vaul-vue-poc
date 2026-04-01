<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Kontaktformular" />
    </template>

    <div class="space-y-3 p-4">
      <p class="text-sm text-gray-500">
        Formular ausfüllen und absenden. "Speichern" gibt die Daten zurück,
        "Abbrechen" gibt null zurück.
      </p>

      <div
        v-if="isDirty"
        class="rounded-lg bg-amber-50 p-2">
        <p class="text-xs text-amber-700">
          Ungespeicherte Änderungen vorhanden.
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Max Mustermann"
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">E-Mail</label>
        <input
          v-model="email"
          type="email"
          placeholder="max@beispiel.de"
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Telefon</label>
        <input
          v-model="phone"
          type="tel"
          placeholder="+49 123 456789"
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Nachricht</label>
        <textarea
          v-model="message"
          rows="3"
          placeholder="Ihre Nachricht..."
          class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
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
          :disabled="!isValid"
          :class="{ 'opacity-50': !isValid }"
          @click="submit">
          Speichern
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const name = ref('');
  const email = ref('');
  const phone = ref('');
  const message = ref('');

  const isValid = computed(() => name.value.trim() && email.value.trim());
  const isDirty = computed(
    () =>
      !!(
        name.value.trim() ||
        email.value.trim() ||
        phone.value.trim() ||
        message.value.trim()
      )
  );

  function submit() {
    dismiss(
      {
        name: name.value,
        email: email.value,
        phone: phone.value,
        message: message.value
      },
      'success'
    );
  }
</script>
