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
            @click="tc.fn()"
          >
            <div class="font-medium">{{ tc.label }}</div>
            <div class="text-sm text-gray-500">{{ tc.desc }}</div>
          </button>
        </div>
      </div>

      <div v-if="dismissLog.length" class="mt-6 rounded-lg bg-gray-100 p-3">
        <p class="text-xs font-semibold text-gray-500 mb-1">Dismiss Log</p>
        <p v-for="(log, i) in dismissLog" :key="i" class="text-xs text-gray-600">
          {{ log }}
        </p>
      </div>

      <div v-if="lastResult" class="mt-6 rounded-lg bg-green-50 p-3">
        <p class="text-sm font-medium text-green-800">Last result:</p>
        <p class="text-sm text-green-700 mt-1 break-all">
          {{ lastResult }}
        </p>
      </div>
    </div>

    <BasicSheet v-if="activeDemo === 'basic'" @close="handleClose" />
    <BreakpointsSheet v-if="activeDemo === 'breakpoints'" @close="handleClose" />
    <FormSheet v-if="activeDemo === 'form'" @close="handleClose" />
    <LongFormSheet v-if="activeDemo === 'longform'" @close="handleClose" />
    <FitContentSheet v-if="activeDemo === 'fitcontent'" @close="handleClose" />
    <FullScreenSheet v-if="activeDemo === 'fullscreen'" @close="handleClose" />
    <StackedSheetA v-if="activeDemo === 'stacked'" @close="handleClose" />
    <DismissResultSheet v-if="activeDemo === 'result'" @close="handleClose" />
    <MultiStepSheet v-if="activeDemo === 'multistep'" @close="handleClose" />

    <DrawerRoot :open="drawerOpen" @update:open="(v: boolean) => (drawerOpen = v)">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
          <DrawerDescription class="sr-only">Drawer for testing toast layering</DrawerDescription>
          <div class="p-4">
            <p class="text-gray-600 mb-4">
              This drawer should appear BELOW the toast. The toast should be visible above this overlay.
            </p>
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
import ToastContainer from "./demos/toast/ToastContainer.vue";
import { useToast, type ToastPosition } from "./demos/toast/useToast";
import {
  DrawerRoot, DrawerPortal, DrawerOverlay, DrawerContent,
  DrawerTitle, DrawerDescription,
} from "vaul-vue";

const activeDemo = ref<string | null>(null);
const lastResult = ref("");
const toast = useToast();
const dismissLog = ref<string[]>([]);
const drawerOpen = ref(false);

const positions: ToastPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"];

function handleClose(result?: string) {
  if (result) {
    lastResult.value = result;
  }
  activeDemo.value = null;
}

function openSheet(id: string) {
  return () => { activeDemo.value = id; };
}

function logDismiss(label: string) {
  dismissLog.value.unshift(`${new Date().toLocaleTimeString()}: ${label} dismissed`);
  if (dismissLog.value.length > 5) dismissLog.value.pop();
}

const demoGroups = [
  {
    section: "Sheets (vaul-vue)",
    tests: [
      { id: "basic", label: "Basic Sheet", desc: "Simple content, swipe to dismiss", fn: openSheet("basic") },
      { id: "breakpoints", label: "Breakpoints", desc: "Snap points at 25%, 50%, 100%", fn: openSheet("breakpoints") },
      { id: "form", label: "Form (Keyboard)", desc: "Critical test — inputs + keyboard", fn: openSheet("form") },
      { id: "longform", label: "Long Form", desc: "Scrollable form, 12 fields", fn: openSheet("longform") },
      { id: "fitcontent", label: "Fit Content", desc: "Auto-sized to content", fn: openSheet("fitcontent") },
      { id: "fullscreen", label: "Full Screen", desc: "Takes entire viewport", fn: openSheet("fullscreen") },
      { id: "stacked", label: "Stacked", desc: "Sheet opens another sheet", fn: openSheet("stacked") },
      { id: "result", label: "Dismiss Result", desc: "Data passed back on dismiss", fn: openSheet("result") },
      { id: "multistep", label: "Multi-Step", desc: "3-step form with back button", fn: openSheet("multistep") },
    ],
  },
  {
    section: "Toast — Types",
    tests: [
      { id: "t-success", label: "Success", desc: "Standard success toast", fn: () => toast.success("Operation completed successfully.") },
      { id: "t-error", label: "Error (persistent)", desc: "Error toast, duration: 0", fn: () => toast.error("Something went wrong. Please try again.", { duration: 0 }) },
      { id: "t-warning", label: "Warning", desc: "Warning toast", fn: () => toast.warning("Your session expires in 5 minutes.") },
      { id: "t-info", label: "Info", desc: "Info toast", fn: () => toast.info("A new version is available.") },
    ],
  },
  {
    section: "Toast — Positions",
    tests: positions.map((pos) => ({
      id: `t-pos-${pos}`,
      label: pos,
      desc: `Toast in ${pos}`,
      fn: () => toast.info(`Toast at ${pos}`, { position: pos }),
    })),
  },
  {
    section: "Toast — Features",
    tests: [
      { id: "t-title", label: "With Title", desc: "Toast with header text", fn: () => toast.error("The server returned a 500 error.", { title: "Server Error", duration: 0 }) },
      { id: "t-action", label: "With Action", desc: "Toast with action button", fn: () => toast.error("Failed to save changes.", { action: { label: "Retry", onClick: () => toast.success("Retried successfully!") }, duration: 0 }) },
      { id: "t-dismiss", label: "With onDismiss", desc: "Callback when dismissed", fn: () => toast.info("Dismiss me and check the log below.", { onDismiss: () => logDismiss("onDismiss toast") }) },
      { id: "t-html", label: "HTML Message", desc: "Message with HTML formatting", fn: () => toast.success("Nächstmögliche Lieferzeit:<br>in <b>15 Minuten</b> oder zum Wunschtermin.") },
      { id: "t-short", label: "Short Duration (3s)", desc: "Auto-closes after 3 seconds", fn: () => toast.info("This disappears in 3 seconds.", { duration: 3000 }) },
    ],
  },
  {
    section: "Toast — Multi-Position & Layering",
    tests: [
      {
        id: "t-4corners", label: "All 4 Corners", desc: "Fire toasts in all corners simultaneously", fn: () => {
          toast.success("Top left", { position: "top-left" });
          toast.error("Top right", { position: "top-right" });
          toast.warning("Bottom left", { position: "bottom-left" });
          toast.info("Bottom right", { position: "bottom-right" });
        },
      },
      {
        id: "t-replace", label: "Replace Same Position", desc: "Fire 2 toasts on bottom-right — second replaces first", fn: () => {
          toast.info("First toast (will be replaced)", { duration: 0 });
          setTimeout(() => toast.success("Second toast (replaced first)"), 500);
        },
      },
      {
        id: "t-layering", label: "Toast Over Drawer", desc: "Opens drawer, then fires toast on top", fn: () => {
          drawerOpen.value = true;
          setTimeout(() => toast.success("I am above the drawer!"), 600);
        },
      },
    ],
  },
];
</script>
