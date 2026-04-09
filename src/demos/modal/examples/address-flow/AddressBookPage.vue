<template>
  <div class="space-y-2 p-4">
    <p class="mb-2 text-sm text-gray-500">
      Gespeicherte Adressen — wähle eine oder erstelle eine neue.
    </p>

    <div
      v-for="(addr, i) in savedAddresses"
      :key="i"
      role="button"
      tabindex="0"
      class="flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left"
      :class="
        isSelected(addr)
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      "
      @click="selectAddress(addr)"
      @keydown.enter="selectAddress(addr)">
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        :class="
          isSelected(addr)
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-400'
        ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle
            cx="12"
            cy="10"
            r="3" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">{{ addr.street }}</p>
        <p class="text-xs text-gray-500">{{ addr.city }}</p>
      </div>
      <button
        class="shrink-0 rounded-md px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
        @click.stop="editAddress(addr)">
        Bearbeiten
      </button>
    </div>

    <button
      class="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700"
      @click="nav.push(AddressSearchPage, { title: 'Neue Adresse' })">
      + Neue Adresse hinzufügen
    </button>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue';
  import { useNavStack } from '../../useNavStack';
  import AddressEditPage from './AddressEditPage.vue';
  import AddressSearchPage from './AddressSearchPage.vue';
  import { ADDRESS_KEY, savedAddresses, type Address } from './addressState';

  const nav = useNavStack();
  const address = inject(ADDRESS_KEY)!;

  function isSelected(addr: Address) {
    return (
      address.value.street === addr.street && address.value.city === addr.city
    );
  }

  function selectAddress(addr: Address) {
    address.value = { ...addr };
    nav.pop();
  }

  function editAddress(addr: Address) {
    nav.push(AddressEditPage, {
      title: 'Adresse bearbeiten',
      props: { address: addr }
    });
  }
</script>
