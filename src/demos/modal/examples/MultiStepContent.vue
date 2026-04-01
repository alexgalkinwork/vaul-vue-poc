<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader
        title="Registration"
        :back-button="step > 1"
        @back="back" />
    </template>

    <div class="space-y-4 p-4">
      <div class="mb-2 flex gap-1.5">
        <div
          v-for="s in 3"
          :key="s"
          class="h-1 flex-1 rounded-full"
          :class="s <= step ? 'bg-blue-600' : 'bg-gray-200'" />
      </div>

      <div
        v-if="step === 1"
        class="space-y-3">
        <p class="text-sm text-gray-500">Step 1 of 3 — Personal Info</p>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="Your full name"
            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>

      <div
        v-if="step === 2"
        class="space-y-3">
        <p class="text-sm text-gray-500">Step 2 of 3 — Address</p>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >Street</label
          >
          <input
            v-model="address"
            type="text"
            placeholder="Musterstraße 42"
            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >City</label
          >
          <input
            v-model="city"
            type="text"
            placeholder="Berlin"
            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>

      <div
        v-if="step === 3"
        class="space-y-3">
        <p class="text-sm text-gray-500">Step 3 of 3 — Confirm</p>
        <div class="space-y-1 rounded-lg bg-gray-50 p-3 text-sm">
          <p><span class="text-gray-500">Name:</span> {{ name || '—' }}</p>
          <p><span class="text-gray-500">Email:</span> {{ email || '—' }}</p>
          <p>
            <span class="text-gray-500">Address:</span>
            {{ address || '—' }}, {{ city || '—' }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="p-4">
        <button
          v-if="step < 3"
          class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
          @click="step++">
          Next
        </button>
        <button
          v-else
          class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
          @click="submit">
          Submit
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';

  const step = ref(1);
  const name = ref('');
  const email = ref('');
  const address = ref('');
  const city = ref('');

  function back() {
    if (step.value > 1) {
      step.value--;
    } else {
      dismiss(null, 'cancel');
    }
  }

  function submit() {
    dismiss(
      {
        name: name.value,
        email: email.value,
        address: address.value,
        city: city.value
      },
      'success'
    );
  }
</script>
