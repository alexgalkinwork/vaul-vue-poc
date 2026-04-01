<template>
  <DrawerRoot
    :open="open"
    @update:open="onOpenChange">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent
        class="fixed right-0 bottom-0 left-0 flex max-h-[96dvh] flex-col rounded-t-2xl bg-white">
        <div
          class="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
        <div class="flex shrink-0 items-center justify-between px-4 pt-2 pb-2">
          <DrawerTitle class="text-lg font-semibold">
            Contact Form
          </DrawerTitle>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
            @click="open = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <DrawerDescription class="sr-only"> Sheet content </DrawerDescription>
        <div class="flex-1 space-y-4 overflow-y-auto p-4">
          <p class="text-sm text-gray-500">
            Tap into any input. The keyboard should NOT cover the input field.
          </p>

          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Name</label
              >
              <input
                v-model="name"
                type="text"
                placeholder="Enter your name"
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
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Phone</label
              >
              <input
                v-model="phone"
                type="tel"
                placeholder="+49 123 456789"
                class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Delivery Time</label
              >
              <select
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <option value="">Select a time slot</option>
                <option value="morning">Morning (8-12)</option>
                <option value="afternoon">Afternoon (12-17)</option>
                <option value="evening">Evening (17-21)</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Notes</label
              >
              <textarea
                v-model="notes"
                rows="3"
                placeholder="Additional notes..."
                class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
              @click="open = false">
              Cancel
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
              @click="save">
              Save
            </button>
          </div>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
  import {
    DrawerContent,
    DrawerDescription,
    DrawerOverlay,
    DrawerPortal,
    DrawerRoot,
    DrawerTitle
  } from '../../lib/vaul-vue';
  import { ref } from 'vue';

  const emit = defineEmits<{ close: [result?: string] }>();
  const open = ref(true);

  const name = ref('');
  const email = ref('');
  const phone = ref('');
  const notes = ref('');

  function onOpenChange(val: boolean) {
    if (!val) emit('close', 'dismiss');
    open.value = val;
  }

  function save() {
    open.value = false;
    emit(
      'close',
      `confirm: ${JSON.stringify({ name: name.value, email: email.value, phone: phone.value, notes: notes.value })}`
    );
  }
</script>
