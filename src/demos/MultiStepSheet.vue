<script setup lang="ts">
import { ref } from 'vue'
import {
  DrawerRoot, DrawerPortal, DrawerOverlay, DrawerContent,
  DrawerTitle, DrawerDescription,
} from 'vaul-vue'

const emit = defineEmits<{ close: [result?: string] }>()
const open = ref(true)

const step = ref(1)
const name = ref('')
const email = ref('')
const address = ref('')
const city = ref('')

function onOpenChange(val: boolean) {
  if (!val) emit('close', 'dismiss')
  open.value = val
}

function next() {
  step.value++
}

function back() {
  if (step.value > 1) {
    step.value--
  } else {
    open.value = false
  }
}

function submit() {
  open.value = false
  emit('close', `confirm: ${JSON.stringify({ name: name.value, email: email.value, address: address.value, city: city.value })}`)
}
</script>

<template>
  <DrawerRoot :open="open" @update:open="onOpenChange">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent class="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white">
        <div class="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300 shrink-0" />
        <div class="flex items-center gap-2 px-4 pt-2 pb-2 shrink-0">
          <button
            class="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 flex items-center justify-center shrink-0"
            @click="back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <DrawerTitle class="text-lg font-semibold flex-1">Registration</DrawerTitle>
          <button
            class="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 flex items-center justify-center shrink-0"
            @click="open = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <DrawerDescription class="sr-only">Sheet content</DrawerDescription>
        <div class="p-4 space-y-4">
          <div class="flex gap-1.5 mb-2">
            <div
              v-for="s in 3"
              :key="s"
              class="h-1 flex-1 rounded-full"
              :class="s <= step ? 'bg-blue-600' : 'bg-gray-200'"
            />
          </div>

          <div v-if="step === 1" class="space-y-3">
            <p class="text-sm text-gray-500">Step 1 of 3</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input v-model="name" type="text" placeholder="Your full name" class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="email" type="email" placeholder="you@example.com" class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
            <button class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700" @click="next">Next</button>
          </div>

          <div v-if="step === 2" class="space-y-3">
            <p class="text-sm text-gray-500">Step 2 of 3</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input v-model="address" type="text" placeholder="Musterstraße 42" class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input v-model="city" type="text" placeholder="Berlin" class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
            </div>
            <button class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700" @click="next">Next</button>
          </div>

          <div v-if="step === 3" class="space-y-3">
            <p class="text-sm text-gray-500">Step 3 of 3 — Confirm your details</p>
            <div class="rounded-lg bg-gray-50 p-3 space-y-1 text-sm">
              <p><span class="text-gray-500">Name:</span> {{ name || '—' }}</p>
              <p><span class="text-gray-500">Email:</span> {{ email || '—' }}</p>
              <p><span class="text-gray-500">Address:</span> {{ address || '—' }}, {{ city || '—' }}</p>
            </div>
            <button class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700" @click="submit">Submit</button>
          </div>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
