<template>
  <div
    vaul-drawer-wrapper
    class="min-h-dvh bg-gray-50">
    <div class="mx-auto max-w-lg p-4 pb-8">
      <h1 class="mb-1 text-2xl font-bold">Vaul-Vue POC</h1>
      <p class="mb-6 text-sm text-gray-500">
        Testing vaul-vue, reka-ui Toast, and responsive modal system.
      </p>

      <div
        v-for="group in demoGroups"
        :key="group.section"
        class="mb-6">
        <h3
          class="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          {{ group.section }}
        </h3>
        <div class="space-y-2">
          <button
            v-for="tc in group.tests"
            :key="tc.id"
            class="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm active:bg-gray-50"
            @click="tc.fn()">
            <div class="font-medium">{{ tc.label }}</div>
            <div class="text-sm text-gray-500">{{ tc.desc }}</div>
          </button>
        </div>
      </div>

      <div class="mb-6">
        <h3
          class="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          DatePicker (reka-ui)
        </h3>
        <DatePickerDemo />
      </div>

      <div
        v-if="dismissLog.length"
        class="mt-6 rounded-lg bg-gray-100 p-3">
        <p class="mb-1 text-xs font-semibold text-gray-500">Dismiss Log</p>
        <p
          v-for="(log, i) in dismissLog"
          :key="i"
          class="text-xs text-gray-600">
          {{ log }}
        </p>
      </div>

      <div
        v-if="lastResult"
        class="mt-6 rounded-lg bg-green-50 p-3">
        <p class="text-sm font-medium text-green-800">Last result:</p>
        <p class="mt-1 text-sm break-all text-green-700">
          {{ lastResult }}
        </p>
      </div>
    </div>

    <DrawerRoot
      :open="drawerOpen"
      @update:open="(v: boolean) => (drawerOpen = v)">
      <DrawerPortal>
        <DrawerOverlay class="fixed inset-0 bg-black/40" />
        <DrawerContent
          class="fixed right-0 bottom-0 left-0 flex max-h-[96dvh] flex-col rounded-t-2xl bg-white">
          <div
            class="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
          <div
            class="flex shrink-0 items-center justify-between px-4 pt-2 pb-2">
            <DrawerTitle class="text-lg font-semibold"
              >Drawer (for layering test)</DrawerTitle
            >
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
              @click="drawerOpen = false">
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
          <DrawerDescription class="sr-only"
            >Drawer for testing toast layering</DrawerDescription
          >
          <div class="p-4">
            <p class="mb-4 text-gray-600">
              This drawer should appear BELOW the toast. The toast should be
              visible above this overlay.
            </p>
            <button
              class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
              @click="toast.info('Fired from inside the drawer!')">
              Fire another toast
            </button>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>

    <ResponsiveModal />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
  import {
    DrawerContent,
    DrawerDescription,
    DrawerOverlay,
    DrawerPortal,
    DrawerRoot,
    DrawerTitle
  } from 'vaul-vue';
  import { ref } from 'vue';
  import DatePickerDemo from './demos/datepicker/DatePickerDemo.vue';
  import BasicContent from './demos/modal/examples/BasicContent.vue';
  import ConfirmContent from './demos/modal/examples/ConfirmContent.vue';
  import FormContent from './demos/modal/examples/FormContent.vue';
  import MultiStepContent from './demos/modal/examples/MultiStepContent.vue';
  import NestedContent from './demos/modal/examples/NestedContent.vue';
  import ScrollContent from './demos/modal/examples/ScrollContent.vue';
  import UndismissableContent from './demos/modal/examples/UndismissableContent.vue';
  import ResponsiveModal from './demos/modal/ResponsiveModal.vue';
  import { showModal, type ModalSize } from './demos/modal/useModal';
  import LongFormContent from './demos/modal/examples/LongFormContent.vue';
  import ToastContainer from './demos/toast/ToastContainer.vue';
  import { useToast, type ToastPosition } from './demos/toast/useToast';

  const lastResult = ref('');
  const toast = useToast();
  const dismissLog = ref<string[]>([]);
  const drawerOpen = ref(false);

  const positions: ToastPosition[] = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ];

  function logDismiss(label: string) {
    dismissLog.value.unshift(`${new Date().toLocaleTimeString()}: ${label}`);
    if (dismissLog.value.length > 10) dismissLog.value.pop();
  }

  async function openModal(
    options: Parameters<typeof showModal>[0],
    label?: string
  ) {
    const result = await showModal(options);
    logDismiss(
      `${label ?? 'Modal'} → role: ${result.role}, data: ${JSON.stringify(result.data)}`
    );
    lastResult.value = `role: ${result.role}, data: ${JSON.stringify(result.data)}`;
  }

  const demoGroups = [
    {
      section: 'Responsive Modal — Sizes',
      tests: (['small', 'medium', 'large'] satisfies ModalSize[]).map(size => ({
        id: `m-size-${size}`,
        label: `${size} (${{ small: '438px', medium: '672px', large: '1140px' }[size]})`,
        desc: `Modal with size="${size}" — sheet on mobile, dialog on desktop`,
        fn: () =>
          openModal(
            {
              component: BasicContent,
              componentProps: {
                title: `${size.charAt(0).toUpperCase() + size.slice(1)} Modal`
              },
              size
            },
            `Size: ${size}`
          )
      }))
    },
    {
      section: 'Responsive Modal — Dismiss Control',
      tests: [
        {
          id: 'm-persistent',
          label: 'Persistent',
          desc: 'No backdrop/swipe/handle — close button + escape work',
          fn: () =>
            openModal(
              {
                component: FormContent,
                size: 'medium',
                dismissible: 'persistent'
              },
              'Persistent'
            )
        },
        {
          id: 'm-locked',
          label: 'Locked (undismissable)',
          desc: 'No close button, no escape, no backdrop, no swipe — auto-closes after 3s',
          fn: () =>
            openModal(
              {
                component: UndismissableContent,
                size: 'small',
                dismissible: false
              },
              'Locked'
            )
        },
        {
          id: 'm-custom-candismiss',
          label: 'Custom canDismiss',
          desc: 'canDismiss blocks escape only, rest allowed',
          fn: () =>
            openModal(
              {
                component: BasicContent,
                componentProps: { title: 'Escape blocked, rest works' },
                size: 'medium',
                canDismiss: reason => reason !== 'escape'
              },
              'Custom canDismiss'
            )
        }
      ]
    },
    {
      section: 'Responsive Modal — Features',
      tests: [
        {
          id: 'm-form-result',
          label: 'Form with Result',
          desc: 'Submit returns data, cancel returns null',
          fn: () =>
            openModal({ component: FormContent, size: 'medium' }, 'Form')
        },
        {
          id: 'm-scroll',
          label: 'Scrollable Content',
          desc: 'Header/footer shadows on scroll',
          fn: () =>
            openModal(
              { component: ScrollContent, size: 'medium' },
              'Scrollable'
            )
        },
        {
          id: 'm-multistep',
          label: 'Multi-Step Form',
          desc: '3-step wizard with back button',
          fn: () =>
            openModal(
              {
                component: MultiStepContent,
                size: 'medium',
                dismissible: 'persistent'
              },
              'Multi-step'
            )
        },
        {
          id: 'm-nested',
          label: 'Nested Modals',
          desc: 'Modal opens modal — test stacking + dismissAll',
          fn: () =>
            openModal(
              {
                component: NestedContent,
                componentProps: { depth: 1, size: 'large' },
                size: 'large'
              },
              'Nested'
            )
        },
        {
          id: 'm-lifecycle',
          label: 'Lifecycle Callbacks',
          desc: 'onPresent, onWillDismiss, onDidDismiss — check console + log',
          fn: () =>
            openModal(
              {
                component: BasicContent,
                componentProps: { title: 'Lifecycle Test' },
                size: 'medium',
                onPresent: () => {
                  console.log('onPresent fired');
                  logDismiss('onPresent fired');
                },
                onWillDismiss: () => {
                  console.log('onWillDismiss fired');
                  logDismiss('onWillDismiss fired');
                },
                onDidDismiss: () => {
                  console.log('onDidDismiss fired');
                  logDismiss('onDidDismiss fired');
                }
              },
              'Lifecycle'
            )
        },
        {
          id: 'm-auto-height',
          label: 'Auto Height (Confirm Dialog)',
          desc: 'Small confirm dialog — height fits content',
          fn: () =>
            openModal(
              {
                component: ConfirmContent,
                componentProps: {
                  title: 'Cancel Order?',
                  message:
                    'Are you sure you want to cancel this order? This action cannot be undone.',
                  confirmLabel: 'Cancel Order'
                },
                size: 'small',
                autoHeight: true
              },
              'Confirm'
            )
        },
        {
          id: 'm-toast-over-modal',
          label: 'Toast Over Modal',
          desc: 'Opens modal, then fires toast — toast should be on top',
          fn: () => {
            showModal({
              component: BasicContent,
              componentProps: { title: 'Modal (toast should be above me)' },
              size: 'medium'
            });
            setTimeout(
              () =>
                toast.success('I am above the modal!'),
              500
            );
          }
        }
      ]
    },
    {
      section: 'Weitere Modal-Demos',
      tests: [
        {
          id: 'm-longform',
          label: 'Langes Formular (12 Felder)',
          desc: 'Scroll + Keyboard bei vielen Inputs',
          fn: () =>
            openModal(
              {
                component: LongFormContent,
                size: 'medium',
                dismissible: 'persistent'
              },
              'Long form'
            )
        },
        {
          id: 'm-fit-content',
          label: 'Auto Height (kurzer Inhalt)',
          desc: 'Modal passt sich der Content-Höhe an',
          fn: () =>
            openModal(
              {
                component: ConfirmContent,
                componentProps: {
                  title: 'Bestellung stornieren?',
                  message:
                    'Möchtest du die Bestellung wirklich stornieren? Dies kann nicht rückgängig gemacht werden.',
                  confirmLabel: 'Stornieren'
                },
                size: 'small',
                autoHeight: true
              },
              'Auto height'
            )
        }
      ]
    },
    {
      section: 'Toast — Types',
      tests: [
        {
          id: 't-success',
          label: 'Success',
          desc: 'Standard success toast',
          fn: () => toast.success('Operation completed successfully.')
        },
        {
          id: 't-error',
          label: 'Error (persistent)',
          desc: 'Error toast, duration: 0',
          fn: () =>
            toast.error('Something went wrong. Please try again.', {
              duration: 0
            })
        },
        {
          id: 't-warning',
          label: 'Warning',
          desc: 'Warning toast',
          fn: () => toast.warning('Your session expires in 5 minutes.')
        },
        {
          id: 't-info',
          label: 'Info',
          desc: 'Info toast',
          fn: () => toast.info('A new version is available.')
        }
      ]
    },
    {
      section: 'Toast — Positions',
      tests: positions.map(pos => ({
        id: `t-pos-${pos}`,
        label: pos,
        desc: `Toast in ${pos}`,
        fn: () => toast.info(`Toast at ${pos}`, { position: pos })
      }))
    },
    {
      section: 'Toast — Features',
      tests: [
        {
          id: 't-title',
          label: 'With Title',
          desc: 'Toast with header text',
          fn: () =>
            toast.error('The server returned a 500 error.', {
              title: 'Server Error',
              duration: 0
            })
        },
        {
          id: 't-action',
          label: 'With Action',
          desc: 'Toast with action button',
          fn: () =>
            toast.error('Failed to save changes.', {
              action: {
                label: 'Retry',
                onClick: () =>
                  toast.success('Retried successfully!', {
                    position: 'top-right'
                  })
              },
              duration: 0
            })
        },
        {
          id: 't-dismiss',
          label: 'With onDismiss',
          desc: 'Callback when dismissed',
          fn: () =>
            toast.info('Dismiss me and check the log below.', {
              onDismiss: () => logDismiss('onDismiss toast')
            })
        },
        {
          id: 't-html',
          label: 'HTML Message',
          desc: 'Message with HTML formatting',
          fn: () =>
            toast.success(
              'Nächstmögliche Lieferzeit:<br>in <b>15 Minuten</b> oder zum Wunschtermin.'
            )
        },
        {
          id: 't-short',
          label: 'Short Duration (3s)',
          desc: 'Auto-closes after 3 seconds',
          fn: () =>
            toast.info('This disappears in 3 seconds.', { duration: 3000 })
        }
      ]
    },
    {
      section: 'Toast — Multi-Position & Layering',
      tests: [
        {
          id: 't-4corners',
          label: 'All 4 Corners',
          desc: 'Fire toasts in all corners simultaneously',
          fn: () => {
            toast.success('Top left', { position: 'top-left' });
            toast.error('Top right', { position: 'top-right' });
            toast.warning('Bottom left', { position: 'bottom-left' });
            toast.info('Bottom right', { position: 'bottom-right' });
          }
        },
        {
          id: 't-replace',
          label: 'Replace Same Position',
          desc: 'Fire 2 toasts on bottom-right — second replaces first',
          fn: () => {
            toast.info('First toast (will be replaced)', { duration: 0 });
            setTimeout(
              () => toast.success('Second toast (replaced first)'),
              500
            );
          }
        },
        {
          id: 't-layering',
          label: 'Toast Over Drawer',
          desc: 'Opens drawer, then fires toast on top',
          fn: () => {
            drawerOpen.value = true;
            setTimeout(() => toast.success('I am above the drawer!'), 600);
          }
        }
      ]
    }
  ];
</script>
