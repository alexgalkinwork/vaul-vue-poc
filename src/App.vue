<template>
  <div vaul-drawer-wrapper class="min-h-dvh bg-gray-50">
    <div class="mx-auto max-w-lg p-4 pb-8">
      <h1 class="text-2xl font-bold mb-1">Vaul-Vue POC</h1>
      <p class="text-sm text-gray-500 mb-6">
        Using vaul-vue from npm — vanilla, no fixes.
      </p>

      <div v-for="group in demoGroups" :key="group.section" class="mb-6">
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {{ group.section }}
        </h3>
        <div class="space-y-2">
          <button
            v-for="tc in group.tests"
            :key="tc.id"
            class="w-full text-left rounded-xl border border-gray-200 bg-white p-4 active:bg-gray-50 shadow-sm"
            @click="activeDemo = tc.id"
          >
            <div class="font-medium">{{ tc.label }}</div>
            <div class="text-sm text-gray-500">{{ tc.desc }}</div>
          </button>
        </div>
      </div>

      <div v-if="lastResult" class="mt-6 rounded-lg bg-green-50 p-3">
        <p class="text-sm font-medium text-green-800">Last result:</p>
        <p class="text-sm text-green-700 mt-1 break-all">
          {{ lastResult }}
        </p>
      </div>
    </div>

    <BasicSheet v-if="activeDemo === 'basic'" @close="handleClose" />
    <BreakpointsSheet
      v-if="activeDemo === 'breakpoints'"
      @close="handleClose"
    />
    <FormSheet v-if="activeDemo === 'form'" @close="handleClose" />
    <LongFormSheet v-if="activeDemo === 'longform'" @close="handleClose" />
    <FitContentSheet v-if="activeDemo === 'fitcontent'" @close="handleClose" />
    <FullScreenSheet v-if="activeDemo === 'fullscreen'" @close="handleClose" />
    <StackedSheetA v-if="activeDemo === 'stacked'" @close="handleClose" />
    <DismissResultSheet v-if="activeDemo === 'result'" @close="handleClose" />
    <MultiStepSheet v-if="activeDemo === 'multistep'" @close="handleClose" />
    <ToastDemo v-if="activeDemo === 'toast'" @close="handleClose" />

    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicSheet from "./demos/sheets/BasicSheet.vue";
import BreakpointsSheet from "./demos/sheets/BreakpointsSheet.vue";
import FormSheet from "./demos/sheets/FormSheet.vue";
import LongFormSheet from "./demos/sheets/LongFormSheet.vue";
import FitContentSheet from "./demos/sheets/FitContentSheet.vue";
import FullScreenSheet from "./demos/sheets/FullScreenSheet.vue";
import StackedSheetA from "./demos/sheets/StackedSheetA.vue";
import DismissResultSheet from "./demos/sheets/DismissResultSheet.vue";
import MultiStepSheet from "./demos/sheets/MultiStepSheet.vue";
import ToastDemo from "./demos/toast/ToastDemo.vue";
import ToastContainer from "./toast/ToastContainer.vue";

const activeDemo = ref<string | null>(null);
const lastResult = ref("");

function handleClose(result?: string) {
  if (result) {
    lastResult.value = result;
  }
  activeDemo.value = null;
}

const demoGroups = [
  {
    section: "Sheets (vaul-vue)",
    tests: [
      { id: "basic", label: "Basic Sheet", desc: "Simple content, swipe to dismiss" },
      { id: "breakpoints", label: "Breakpoints", desc: "Snap points at 25%, 50%, 100%" },
      { id: "form", label: "Form (Keyboard)", desc: "Critical test — inputs + keyboard" },
      { id: "longform", label: "Long Form", desc: "Scrollable form, 12 fields" },
      { id: "fitcontent", label: "Fit Content", desc: "Auto-sized to content" },
      { id: "fullscreen", label: "Full Screen", desc: "Takes entire viewport" },
      { id: "stacked", label: "Stacked", desc: "Sheet opens another sheet" },
      { id: "result", label: "Dismiss Result", desc: "Data passed back on dismiss" },
      { id: "multistep", label: "Multi-Step", desc: "3-step form with back button" },
    ],
  },
  {
    section: "Toast (reka-ui)",
    tests: [
      { id: "toast", label: "Toast Demo", desc: "Types, positions, layering, actions" },
    ],
  },
];
</script>
