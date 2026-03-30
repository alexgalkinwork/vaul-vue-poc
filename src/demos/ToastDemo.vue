<script setup lang="ts">
import { ref } from 'vue'
import { useToast, type ToastPosition } from '../composables/useToast'
import {
  DrawerRoot, DrawerPortal, DrawerOverlay, DrawerContent,
  DrawerTitle, DrawerDescription,
} from 'vaul-vue'

const emit = defineEmits<{ close: [result?: string] }>()
const toast = useToast()
const dismissLog = ref<string[]>([])
const drawerOpen = ref(false)

const positions: ToastPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

function logDismiss(label: string) {
  dismissLog.value.unshift(`${new Date().toLocaleTimeString()}: ${label} dismissed`)
  if (dismissLog.value.length > 5) dismissLog.value.pop()
}

const testCases = [
  {
    section: 'Types',
    tests: [
      {
        label: 'Success',
        desc: 'Standard success toast',
        fn: () => toast.success('Operation completed successfully.'),
      },
      {
        label: 'Error',
        desc: 'Error toast, persistent',
        fn: () => toast.error('Something went wrong. Please try again.', { duration: 0 }),
      },
      {
        label: 'Warning',
        desc: 'Warning toast',
        fn: () => toast.warning('Your session expires in 5 minutes.'),
      },
      {
        label: 'Info',
        desc: 'Info toast',
        fn: () => toast.info('A new version is available.'),
      },
    ],
  },
  {
    section: 'Positions',
    tests: positions.map(pos => ({
      label: pos,
      desc: `Toast in ${pos}`,
      fn: () => toast.info(`Toast at ${pos}`, { position: pos }),
    })),
  },
  {
    section: 'Features',
    tests: [
      {
        label: 'With Title',
        desc: 'Toast with header text',
        fn: () => toast.error('The server returned a 500 error.', {
          title: 'Server Error',
          duration: 0,
        }),
      },
      {
        label: 'With Action',
        desc: 'Toast with action button',
        fn: () => toast.error('Failed to save changes.', {
          action: { label: 'Retry', onClick: () => toast.success('Retried successfully!') },
          duration: 0,
        }),
      },
      {
        label: 'With onDismiss',
        desc: 'Callback when dismissed',
        fn: () => {
          toast.info('Dismiss me and check the log below.', {
            onDismiss: () => logDismiss('onDismiss toast'),
          })
        },
      },
      {
        label: 'HTML Message',
        desc: 'Message with HTML formatting',
        fn: () => toast.success('Nächstmögliche Lieferzeit:<br>in <b>15 Minuten</b> oder zum Wunschtermin.'),
      },
      {
        label: 'Short Duration (3s)',
        desc: 'Auto-closes after 3 seconds',
        fn: () => toast.info('This disappears in 3 seconds.', { duration: 3000 }),
      },
    ],
  },
  {
    section: 'Multi-Position',
    tests: [
      {
        label: 'All 4 Corners',
        desc: 'Fire toasts in all corners simultaneously',
        fn: () => {
          toast.success('Top left', { position: 'top-left' })
          toast.error('Top right', { position: 'top-right' })
          toast.warning('Bottom left', { position: 'bottom-left' })
          toast.info('Bottom right', { position: 'bottom-right' })
        },
      },
      {
        label: 'Replace Same Position',
        desc: 'Fire 2 toasts on bottom-right — second replaces first',
        fn: () => {
          toast.info('First toast (will be replaced)', { duration: 0 })
          setTimeout(() => toast.success('Second toast (replaced first)'), 500)
        },
      },
    ],
  },
  {
    section: 'Layering',
    tests: [
      {
        label: 'Toast Over Drawer',
        desc: 'Opens drawer, then fires toast on top',
        fn: () => {
          drawerOpen.value = true
          setTimeout(() => toast.success('I am above the drawer!'), 600)
        },
      },
    ],
  },
]
</script>

<template>
  <div class="mx-auto max-w-lg p-4 pb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold">Toast Demo</h2>
        <p class="text-sm text-gray-500">Reka UI Toast evaluation</p>
      </div>
      <button
        class="text-sm text-blue-600 font-medium"
        @click="emit('close')"
      >
        Back
      </button>
    </div>

    <div v-for="group in testCases" :key="group.section" class="mb-6">
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {{ group.section }}
      </h3>
      <div class="space-y-2">
        <button
          v-for="tc in group.tests"
          :key="tc.label"
          class="w-full text-left rounded-xl border border-gray-200 bg-white p-3 active:bg-gray-50 shadow-sm"
          @click="tc.fn()"
        >
          <div class="font-medium text-sm">{{ tc.label }}</div>
          <div class="text-xs text-gray-500">{{ tc.desc }}</div>
        </button>
      </div>
    </div>

    <div v-if="dismissLog.length" class="rounded-lg bg-gray-100 p-3">
      <p class="text-xs font-semibold text-gray-500 mb-1">Dismiss Log</p>
      <p v-for="(log, i) in dismissLog" :key="i" class="text-xs text-gray-600">{{ log }}</p>
    </div>
  </div>

  <DrawerRoot :open="drawerOpen" @update:open="(v: boolean) => drawerOpen = v">
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/40" />
      <DrawerContent class="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-white max-h-[96dvh]">
        <div class="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300 shrink-0" />
        <div class="flex items-center justify-between px-4 pt-2 pb-2 shrink-0">
          <DrawerTitle class="text-lg font-semibold">Drawer (for layering test)</DrawerTitle>
          <button
            class="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 flex items-center justify-center"
            @click="drawerOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <DrawerDescription class="sr-only">Drawer for testing toast layering</DrawerDescription>
        <div class="p-4">
          <p class="text-gray-600 mb-4">This drawer should appear BELOW the toast. The toast should be visible above this overlay.</p>
          <button
            class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium active:bg-blue-700"
            @click="toast.info('Fired from inside the drawer!')"
          >
            Fire another toast
          </button>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
