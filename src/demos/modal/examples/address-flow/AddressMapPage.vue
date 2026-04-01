<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 items-center justify-center bg-gray-100 p-8">
      <div class="text-center">
        <div
          class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-gray-400">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle
              cx="12"
              cy="10"
              r="3" />
          </svg>
        </div>
        <p class="text-sm text-gray-500">
          Hier würde die Google Maps Karte angezeigt
        </p>
        <p class="mt-1 text-xs text-gray-400">
          Pin verschieben um Adresse zu wählen
        </p>
      </div>
    </div>

    <div class="shrink-0 space-y-2 p-4">
      <div class="rounded-lg bg-gray-50 p-2">
        <p class="text-xs text-gray-500">Gewählte Position</p>
        <p class="text-sm font-medium text-gray-900">
          Alexanderplatz 1, 10178 Berlin
        </p>
      </div>
      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
        @click="confirm">
        Standort bestätigen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue';
  import { useNavStack } from '../../useNavStack';
  import { ADDRESS_KEY } from './addressState';

  const nav = useNavStack();
  const address = inject(ADDRESS_KEY)!;

  function confirm() {
    address.value = { street: 'Alexanderplatz 1', city: '10178 Berlin' };
    nav.popToRoot();
  }
</script>
