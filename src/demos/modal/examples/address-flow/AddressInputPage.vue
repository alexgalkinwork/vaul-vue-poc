<template>
  <div class="space-y-4 p-4">
    <div class="rounded-lg border border-gray-200 p-3">
      <p class="text-xs font-medium tracking-wider text-gray-400 uppercase">
        Aktuelle Lieferadresse
      </p>
      <p class="mt-1 font-medium text-gray-900">Max Mustermann</p>
      <p class="text-sm text-gray-600">
        {{ address.street }}, {{ address.city }}
      </p>
      <p
        v-if="address.note"
        class="mt-1 text-xs text-gray-400 italic">
        {{ address.note }}
      </p>
    </div>

    <div class="space-y-2">
      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
        @click="
          nav.push(AddressBookPage, { title: 'Adressbuch' })
        ">
        Aus Adressbuch wählen
      </button>

      <button
        class="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
        @click="
          nav.push(AddressSearchPage, { title: 'Adresse suchen' })
        ">
        Neue Adresse suchen
      </button>

      <button
        class="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
        @click="
          nav.push(AddressMapPage, { title: 'Auf Karte wählen' })
        ">
        Auf Karte wählen
      </button>

      <button
        class="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
        @click="
          nav.push(DeliveryNotePage, { title: 'Lieferhinweis' })
        ">
        Lieferhinweis
        <span
          v-if="address.note"
          class="ml-1 text-xs text-gray-400">
          ({{ address.note }})
        </span>
      </button>
    </div>

    <button
      class="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white active:bg-green-700"
      @click="dismiss({ address }, 'confirm')">
      Adresse bestätigen
    </button>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue';
  import { dismiss } from '../../useModal';
  import { useNavStack } from '../../useNavStack';
  import { ADDRESS_KEY } from './addressState';
  import AddressBookPage from './AddressBookPage.vue';
  import AddressMapPage from './AddressMapPage.vue';
  import AddressSearchPage from './AddressSearchPage.vue';
  import DeliveryNotePage from './DeliveryNotePage.vue';

  const nav = useNavStack();
  const address = inject(ADDRESS_KEY)!;
</script>
