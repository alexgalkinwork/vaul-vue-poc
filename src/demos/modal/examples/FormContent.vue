<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Contact Form" />
    </template>

    <div class="p-4 space-y-3">
      <p class="text-sm text-gray-500">
        Fill in the form and submit. Swipe/backdrop dismiss is prevented while
        fields are dirty.
      </p>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name"
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Notes</label
        >
        <textarea
          v-model="notes"
          rows="3"
          placeholder="Additional notes..."
          class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 p-4">
        <button
          class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
          @click="dismiss(null, 'cancel')"
        >
          Cancel
        </button>
        <button
          class="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700"
          :disabled="!isValid"
          :class="{ 'opacity-50': !isValid }"
          @click="submit"
        >
          Save
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ModalTemplate from "../ModalTemplate.vue";
import ModalHeader from "../ModalHeader.vue";
import { dismiss } from "../useModal";

const name = ref("");
const email = ref("");
const notes = ref("");

const isValid = computed(() => name.value.trim() && email.value.trim());

function submit() {
  dismiss(
    { name: name.value, email: email.value, notes: notes.value },
    "success",
  );
}
</script>
