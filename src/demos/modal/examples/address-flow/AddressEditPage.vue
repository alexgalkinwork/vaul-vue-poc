<template>
  <div class="space-y-3 p-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">Straße</label>
      <input
        v-model="street"
        type="text"
        class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">PLZ & Stadt</label>
      <input
        v-model="city"
        type="text"
        class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">
        Lieferhinweis (optional)
      </label>
      <input
        v-model="note"
        type="text"
        placeholder="z.B. Hintereingang, 2. Klingel"
        class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <div class="flex gap-3 pt-2">
      <button
        class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
        @click="nav.pop()">
        Abbrechen
      </button>
      <button
        class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
        @click="save">
        Speichern
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import { useNavStack } from '../../useNavStack';
  import { ADDRESS_KEY, type Address } from './addressState';

  const { address: initialAddress } = defineProps<{
    address: Address;
  }>();

  const nav = useNavStack();
  const selectedAddress = inject(ADDRESS_KEY)!;

  const street = ref(initialAddress.street);
  const city = ref(initialAddress.city);
  const note = ref(initialAddress.note ?? '');

  function save() {
    selectedAddress.value = {
      street: street.value,
      city: city.value,
      note: note.value || undefined
    };
    nav.popToRoot();
  }
</script>
