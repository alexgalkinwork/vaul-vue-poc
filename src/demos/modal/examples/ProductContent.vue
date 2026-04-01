<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <div class="relative shrink-0">
      <img
        src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=400&fit=crop"
        alt="Produkt"
        class="h-48 w-full object-cover" />
      <ModalClose class="absolute top-3 right-3 bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white" />
    </div>

    <div class="flex-1 space-y-4 overflow-y-auto p-4">
      <div>
        <p class="text-xs font-medium tracking-wider text-gray-400 uppercase">
          Bio-Gemüse
        </p>
        <h2 class="text-xl font-bold text-gray-900">
          Frische Bio-Tomaten 500g
        </h2>
        <p class="mt-1 text-lg font-semibold text-green-600">€ 3,49</p>
      </div>

      <p class="text-sm leading-relaxed text-gray-600">
        Sonnengereift und handverlesen aus regionalem Bio-Anbau. Perfekt für
        Salate, Saucen und zum Snacken. Unsere Tomaten werden ohne künstliche
        Dünger oder Pestizide angebaut.
      </p>

      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
            ✓
          </span>
          Bio-zertifiziert (DE-ÖKO-001)
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
            ✓
          </span>
          Regionaler Anbau, max. 50km Entfernung
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
            ✓
          </span>
          Lieferung innerhalb von 24 Stunden
        </div>
      </div>

      <div class="rounded-lg bg-amber-50 p-3">
        <p class="text-sm font-medium text-amber-800">Hinweis</p>
        <p class="mt-0.5 text-xs text-amber-700">
          Gewicht kann leicht variieren. Mindesthaltbarkeit: 5 Tage nach
          Lieferung.
        </p>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-3 border-t border-gray-100 p-4">
      <div class="flex items-center gap-2">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          @click="quantity = Math.max(1, quantity - 1)">
          −
        </button>
        <span class="w-8 text-center text-sm font-medium tabular-nums">
          {{ quantity }}
        </span>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          @click="quantity++">
          +
        </button>
      </div>
      <button
        class="flex-1 rounded-lg bg-green-600 px-4 py-3 font-medium text-white active:bg-green-700"
        @click="
          dismiss({ productId: 'tomaten-500g', quantity }, 'add-to-cart')
        ">
        In den Warenkorb · € {{ (3.49 * quantity).toFixed(2) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ModalClose from '../ModalClose.vue';
  import { dismiss } from '../useModal';

  const quantity = ref(1);
</script>
