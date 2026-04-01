<template>
  <div class="space-y-3 p-4">
    <input
      v-model="query"
      type="text"
      placeholder="Straße, PLZ oder Ort eingeben..."
      class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />

    <div
      v-for="addr in filtered"
      :key="addr.id"
      class="cursor-default rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50"
      @click="selectAddress(addr)">
      <p class="text-sm font-medium text-gray-900">{{ addr.street }}</p>
      <p class="text-xs text-gray-500">{{ addr.city }}</p>
    </div>

    <p
      v-if="query && filtered.length === 0"
      class="text-center text-sm text-gray-400">
      Keine Ergebnisse für "{{ query }}"
    </p>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, ref } from 'vue';
  import { useNavStack } from '../../useNavStack';
  import { ADDRESS_KEY } from './addressState';

  const nav = useNavStack();
  const address = inject(ADDRESS_KEY)!;
  const query = ref('');

  const addresses = [
    { id: 1, street: 'Friedrichstraße 123', city: '10117 Berlin' },
    { id: 2, street: 'Hauptstraße 45', city: '80331 München' },
    { id: 3, street: 'Königsallee 7', city: '40212 Düsseldorf' },
    { id: 4, street: 'Mönckebergstraße 18', city: '20095 Hamburg' },
    { id: 5, street: 'Zeil 112', city: '60313 Frankfurt' }
  ];

  const filtered = computed(() =>
    query.value
      ? addresses.filter(
          a =>
            a.street.toLowerCase().includes(query.value.toLowerCase()) ||
            a.city.toLowerCase().includes(query.value.toLowerCase())
        )
      : addresses
  );

  function selectAddress(addr: (typeof addresses)[number]) {
    address.value = { street: addr.street, city: addr.city };
    nav.pop();
  }
</script>
