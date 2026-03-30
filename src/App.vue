<template>
  <div
    vaul-drawer-wrapper
    class="min-h-dvh bg-gray-50"
  >
    <div class="mx-auto max-w-lg p-4 pb-8">
      <h1 class="text-2xl font-bold mb-1">
        Vaul-Vue POC
      </h1>
      <p class="text-sm text-gray-500 mb-6">
        Using vaul-vue from npm — vanilla, no fixes.
      </p>

      <div class="space-y-3">
        <button
          v-for="tc in testCases"
          :key="tc.id"
          class="w-full text-left rounded-xl border border-gray-200 bg-white p-4 active:bg-gray-50 shadow-sm"
          @click="activeDemo = tc.id"
        >
          <div class="font-medium">
            {{ tc.label }}
          </div>
          <div class="text-sm text-gray-500">
            {{ tc.desc }}
          </div>
        </button>
      </div>

      <div
        v-if="lastResult"
        class="mt-6 rounded-lg bg-green-50 p-3"
      >
        <p class="text-sm font-medium text-green-800">
          Last result:
        </p>
        <p class="text-sm text-green-700 mt-1 break-all">
          {{ lastResult }}
        </p>
      </div>
    </div>

    <BasicSheet
      v-if="activeDemo === 'basic'"
      @close="handleClose"
    />
    <BreakpointsSheet
      v-if="activeDemo === 'breakpoints'"
      @close="handleClose"
    />
    <FormSheet
      v-if="activeDemo === 'form'"
      @close="handleClose"
    />
    <LongFormSheet
      v-if="activeDemo === 'longform'"
      @close="handleClose"
    />
    <FitContentSheet
      v-if="activeDemo === 'fitcontent'"
      @close="handleClose"
    />
    <FullScreenSheet
      v-if="activeDemo === 'fullscreen'"
      @close="handleClose"
    />
    <StackedSheetA
      v-if="activeDemo === 'stacked'"
      @close="handleClose"
    />
    <DismissResultSheet
      v-if="activeDemo === 'result'"
      @close="handleClose"
    />
    <MultiStepSheet
      v-if="activeDemo === 'multistep'"
      @close="handleClose"
    />
    <ToastDemo
      v-if="activeDemo === 'toast'"
      @close="handleClose"
    />

    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicSheet from './demos/BasicSheet.vue'
import BreakpointsSheet from './demos/BreakpointsSheet.vue'
import FormSheet from './demos/FormSheet.vue'
import LongFormSheet from './demos/LongFormSheet.vue'
import FitContentSheet from './demos/FitContentSheet.vue'
import FullScreenSheet from './demos/FullScreenSheet.vue'
import StackedSheetA from './demos/StackedSheetA.vue'
import DismissResultSheet from './demos/DismissResultSheet.vue'
import MultiStepSheet from './demos/MultiStepSheet.vue'
import ToastDemo from './demos/ToastDemo.vue'
import ToastContainer from './components/ToastContainer.vue'

const activeDemo = ref<string | null>(null)
const lastResult = ref('')

function handleClose(result?: string) {
  if (result) {
    lastResult.value = result
  }
  activeDemo.value = null
}

const testCases = [
  { id: 'basic', label: '1. Basic Sheet', desc: 'Simple content, swipe to dismiss' },
  { id: 'breakpoints', label: '2. Breakpoints', desc: 'Snap points at 25%, 50%, 100%' },
  { id: 'form', label: '3. Form (Keyboard)', desc: 'Critical test — inputs + keyboard' },
  { id: 'longform', label: '4. Long Form', desc: 'Scrollable form, 12 fields' },
  { id: 'fitcontent', label: '5. Fit Content', desc: 'Auto-sized to content' },
  { id: 'fullscreen', label: '6. Full Screen', desc: 'Takes entire viewport' },
  { id: 'stacked', label: '7. Stacked', desc: 'Sheet opens another sheet' },
  { id: 'result', label: '8. Dismiss Result', desc: 'Data passed back on dismiss' },
  { id: 'multistep', label: '9. Multi-Step', desc: '3-step form with back button' },
  { id: 'toast', label: '10. Toast (Reka UI)', desc: 'Toast evaluation — types, positions, layering' },
]
</script>
