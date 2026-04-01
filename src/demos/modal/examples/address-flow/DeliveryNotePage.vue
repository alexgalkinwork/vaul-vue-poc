<template>
  <div class="space-y-3 p-4">
    <p class="text-sm text-gray-500">
      Hinterlasse Hinweise für den Lieferfahrer.
    </p>

    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">
        Lieferhinweis
      </label>
      <textarea
        v-model="note"
        rows="3"
        placeholder="z.B. Bitte an der Hintertür klingeln, 3. OG links..."
        class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <div class="space-y-2">
      <p class="text-xs font-medium text-gray-500">Schnellauswahl</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in quickTags"
          :key="tag"
          class="rounded-full border border-gray-200 px-3 py-1 text-xs hover:border-blue-300 hover:bg-blue-50"
          :class="
            note.includes(tag)
              ? 'border-blue-400 bg-blue-50 text-blue-700'
              : 'text-gray-600'
          "
          @click="toggleTag(tag)">
          {{ tag }}
        </button>
      </div>
    </div>

    <button
      class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
      @click="save">
      Hinweis speichern
    </button>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import { useNavStack } from '../../useNavStack';
  import { ADDRESS_KEY } from './addressState';

  const nav = useNavStack();
  const address = inject(ADDRESS_KEY)!;

  const note = ref(address.value.note ?? '');

  const quickTags = [
    'Hintereingang',
    'Bitte klingeln',
    'Nicht klingeln',
    'Paket abstellen',
    'Nachbar abgeben',
    'Anrufen bei Ankunft'
  ];

  function toggleTag(tag: string) {
    if (note.value.includes(tag)) {
      note.value = note.value.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim();
    } else {
      note.value = note.value ? `${note.value}, ${tag}` : tag;
    }
  }

  function save() {
    address.value = { ...address.value, note: note.value || undefined };
    nav.pop();
  }
</script>
