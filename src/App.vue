<template>
  <div
    vaul-drawer-wrapper
    class="min-h-dvh bg-gray-50">
    <div class="mx-auto max-w-2xl p-4 pb-8">
      <h1 class="mb-1 text-2xl font-bold">Reka UI Component POC</h1>
      <p class="mb-8 text-sm text-gray-500">
        Evaluierung von reka-ui + vaul-vue als Ionic-Ersatz. Responsive Modals,
        Toasts und DatePicker.
      </p>

      <!-- Modals -->
      <section class="mb-10">
        <div class="mb-4 border-l-4 border-blue-500 pl-3">
          <h2 class="text-lg font-bold text-gray-900">Responsive Modals</h2>
          <p class="text-sm text-gray-500">
            Auf Desktop (≥1200px) als Dialog, auf Mobile als Bottom Sheet.
            Eine API für beides.
          </p>
        </div>

        <div
          v-for="group in modalGroups"
          :key="group.section"
          class="mb-5">
          <h3
            class="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {{ group.section }}
          </h3>
          <div class="grid gap-2" :class="group.grid ?? 'grid-cols-1'">
            <button
              v-for="tc in group.tests"
              :key="tc.id"
              class="rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm active:bg-gray-50"
              @click="tc.fn()">
              <div class="text-sm font-medium">{{ tc.label }}</div>
              <div class="mt-0.5 text-xs text-gray-500">{{ tc.desc }}</div>
            </button>
          </div>
        </div>
      </section>

      <!-- Toasts -->
      <section class="mb-10">
        <div class="mb-4 border-l-4 border-green-500 pl-3">
          <h2 class="text-lg font-bold text-gray-900">Toasts</h2>
          <p class="text-sm text-gray-500">
            Benachrichtigungen in allen 4 Ecken. Ersetzt Ionic toastController +
            CommandBus.
          </p>
        </div>

        <div
          v-for="group in toastGroups"
          :key="group.section"
          class="mb-5">
          <h3
            class="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {{ group.section }}
          </h3>
          <div class="grid gap-2" :class="group.grid ?? 'grid-cols-1'">
            <button
              v-for="tc in group.tests"
              :key="tc.id"
              class="rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm active:bg-gray-50"
              @click="tc.fn()">
              <div class="text-sm font-medium">{{ tc.label }}</div>
              <div class="mt-0.5 text-xs text-gray-500">{{ tc.desc }}</div>
            </button>
          </div>
        </div>
      </section>

      <!-- DatePicker -->
      <section class="mb-10">
        <div class="mb-4 border-l-4 border-purple-500 pl-3">
          <h2 class="text-lg font-bold text-gray-900">DatePicker</h2>
          <p class="text-sm text-gray-500">
            Datum- und Zeitraum-Auswahl mit Kalender. Lokalisierung, Min/Max,
            deaktivierte Tage.
          </p>
        </div>
        <DatePickerDemo />
      </section>

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
  import LongFormContent from './demos/modal/examples/LongFormContent.vue';
  import MultiStepContent from './demos/modal/examples/MultiStepContent.vue';
  import NestedContent from './demos/modal/examples/NestedContent.vue';
  import ProductContent from './demos/modal/examples/ProductContent.vue';
  import ScrollContent from './demos/modal/examples/ScrollContent.vue';
  import TimeslotContent from './demos/modal/examples/TimeslotContent.vue';
  import UndismissableContent from './demos/modal/examples/UndismissableContent.vue';
  import ResponsiveModal from './demos/modal/ResponsiveModal.vue';
  import { showModal, type ModalSize } from './demos/modal/useModal';
  import ToastContainer from './demos/toast/ToastContainer.vue';
  import { useToast, type ToastPosition } from './demos/toast/useToast';

  const toast = useToast();
  const drawerOpen = ref(false);

  const positions: ToastPosition[] = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ];

  async function openModal(
    options: Parameters<typeof showModal>[0],
    label?: string
  ) {
    const result = await showModal(options);
    console.log(`[Modal] ${label ?? 'Modal'}`, result);
  }

  const modalGroups = [
    {
      section: 'Größen',
      grid: 'grid-cols-3',
      tests: (['small', 'medium', 'large'] satisfies ModalSize[]).map(size => ({
        id: `m-size-${size}`,
        label: `${size} (${{ small: '438px', medium: '672px', large: '1140px' }[size]})`,
        desc: `${{ small: 'Login, Bestätigung, kleine Dialoge', medium: 'Formulare, CMS-Inhalte, Standard', large: 'Karten, große Tabellen, Produktübersichten' }[size]} — auf Mobile automatisch als Sheet`,
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
      section: 'Dismiss-Kontrolle',
      tests: [
        {
          id: 'm-persistent',
          label: 'Persistent',
          desc: 'Für Formulare: versehentliches Schließen per Swipe/Backdrop verhindert. Close-Button + Escape gehen weiterhin.',
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
          desc: 'Für Ladezustände/Zahlungen: kein Schließen möglich, kein Close-Button. Schließt automatisch nach 3s (simuliert API-Call).',
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
          desc: 'Für Sonderfälle: eigene Logik welche Dismiss-Methoden erlaubt sind. Hier: Escape blockiert, Rest geht.',
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
      section: 'Features',
      tests: [
        {
          id: 'm-form-result',
          label: 'Formular mit Rückgabewert',
          desc: 'Wie Adressformular: Speichern gibt Daten zurück, Abbrechen gibt null. Backdrop/Swipe blockiert bei ungespeicherten Änderungen.',
          fn: () =>
            openModal(
              {
                component: FormContent,
                size: 'medium',
                dismissible: 'persistent'
              },
              'Form'
            )
        },
        {
          id: 'm-scroll',
          label: 'Scrollbarer Inhalt (AGB)',
          desc: 'Wie AGB/Datenschutz: langer Text mit Scroll-Indikatoren an Header und Footer. Zeigt ob noch mehr Content da ist.',
          fn: () =>
            openModal(
              { component: ScrollContent, size: 'medium' },
              'Scrollable'
            )
        },
        {
          id: 'm-multistep',
          label: 'Multi-Step Formular',
          desc: 'Wie Registrierung/Onboarding: 3 Schritte mit Fortschrittsbalken und Zurück-Button. Swipe blockiert damit kein Schritt verloren geht.',
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
          label: 'Verschachtelte Modals',
          desc: 'Wie Adressbuch → Adresse bearbeiten: Modal öffnet weiteres Modal. Verschiedene Größen, "Alle schließen" Button. Backdrop wird nicht dunkler.',
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
          desc: 'Für Tracking/Analytics: Events bei Modal-Open und -Close. Prüfe Console und Log unten.',
          fn: () =>
            openModal(
              {
                component: BasicContent,
                componentProps: { title: 'Lifecycle Test' },
                size: 'medium',
                onPresent: () => {
                  console.log('onPresent fired');
                  console.log('[Modal] onPresent');
                },
                onWillDismiss: () => {
                  console.log('onWillDismiss fired');
                  console.log('[Modal] onWillDismiss');
                },
                onDidDismiss: () => {
                  console.log('onDidDismiss fired');
                  console.log('[Modal] onDidDismiss');
                }
              },
              'Lifecycle'
            )
        },
        {
          id: 'm-auto-height',
          label: 'Auto Height (Confirm Dialog)',
          desc: 'Für Bestätigungen: Modal ist nur so hoch wie der Inhalt, kein leerer Platz. Wie "Bestellung stornieren?" Dialog.',
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
          label: 'Toast über Modal',
          desc: 'Toast muss über dem Modal sichtbar sein — z.B. Fehlermeldung während ein Formular offen ist.',
          fn: () => {
            showModal({
              component: BasicContent,
              componentProps: { title: 'Modal (toast should be above me)' },
              size: 'medium'
            });
            setTimeout(() => toast.success('I am above the modal!'), 500);
          }
        }
      ]
    },
    {
      section: 'Realistische Beispiele',
      tests: [
        {
          id: 'm-longform',
          label: 'Langes Formular (12 Felder)',
          desc: 'Wie Registrierung mit vielen Feldern: testet Scroll-Verhalten und ob Keyboard das aktive Feld nicht verdeckt.',
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
          label: 'Stornierung (Auto Height)',
          desc: 'Wie "Bestellung stornieren?": kleiner Dialog der sich der Content-Höhe anpasst statt den ganzen Bildschirm zu nehmen.',
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
        },
        {
          id: 'm-product',
          label: 'Produkt-Quickview',
          desc: 'Wie Produktdetail-Popup: Bild oben (kein Standard-Header), Mengenauswahl + Warenkorb-Button unten. Komplett eigenes Layout.',
          fn: () =>
            openModal({ component: ProductContent, size: 'small' }, 'Product')
        },
        {
          id: 'm-timeslot',
          label: 'Lieferzeit wählen',
          desc: 'Wie Zeitfenster-Auswahl: Custom Header mit Datum, wählbare Zeitslots mit Preisen/Verfügbarkeit, Bestätigung im Footer.',
          fn: () =>
            openModal(
              {
                component: TimeslotContent,
                size: 'small',
                dismissible: 'persistent'
              },
              'Timeslot'
            )
        }
      ]
    }
  ];

  const toastGroups = [
    {
      section: 'Typen',
      grid: 'grid-cols-2',
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
      section: 'Positionen',
      grid: 'grid-cols-2',
      tests: positions.map(pos => ({
        id: `t-pos-${pos}`,
        label: pos,
        desc: `Toast in ${pos}`,
        fn: () => toast.info(`Toast at ${pos}`, { position: pos })
      }))
    },
    {
      section: 'Features',
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
              onDismiss: () => console.log('[Toast] onDismiss')
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
      section: 'Layering',
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
