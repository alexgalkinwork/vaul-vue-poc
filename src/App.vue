<template>
  <div
    vaul-drawer-wrapper
    class="min-h-dvh touch-manipulation bg-gray-50 select-none">
    <!-- Header -->
    <header class="sticky top-0 z-30 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
      <div class="mx-auto max-w-3xl px-5 py-5">
        <div class="flex items-baseline gap-3">
          <h1 class="text-lg font-bold tracking-tight text-gray-900">
            Component Lab
          </h1>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            reka-ui + vaul-vue
          </span>
        </div>
        <p class="mt-0.5 text-[13px] text-gray-400">
          Ionic-Ersatz Evaluierung
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-5 pt-10 pb-16">

      <!-- ==================== MODALS ==================== -->
      <section class="mb-16 animate-fade-up" style="animation-delay: 50ms">
        <SectionHeader
          title="Responsive Modals"
          subtitle="Desktop ≥1200px → Dialog, Mobile → Sheet"
          accent="bg-blue-500" />

        <!-- Größen: compact chips -->
        <div class="mb-8">
          <GroupLabel>Größen</GroupLabel>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in (['small', 'medium', 'large'] satisfies ModalSize[])"
              :key="size"
              class="rounded-lg border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 active:bg-gray-100"
              @click="openModal({ component: BasicContent, componentProps: { title: `${size.charAt(0).toUpperCase() + size.slice(1)} Modal` }, size }, `Size: ${size}`)">
              {{ size }}
              <span class="ml-1.5 tabular-nums text-gray-400">{{ { small: '438px', medium: '672px', large: '1140px' }[size] }}</span>
            </button>
          </div>
        </div>

        <!-- Dismiss-Kontrolle -->
        <div class="mb-8">
          <GroupLabel>Dismiss-Kontrolle</GroupLabel>
          <CardGrid>
            <CardButton
              v-for="tc in dismissTests"
              :key="tc.id"
              :label="tc.label"
              :desc="tc.desc"
              @click="tc.fn()" />
          </CardGrid>
        </div>

        <!-- Features -->
        <div class="mb-8">
          <GroupLabel>Features</GroupLabel>
          <CardGrid>
            <CardButton
              v-for="tc in featureTests"
              :key="tc.id"
              :label="tc.label"
              :desc="tc.desc"
              @click="tc.fn()" />
          </CardGrid>
        </div>

        <!-- Realistische Beispiele -->
        <div>
          <GroupLabel>Realistische Beispiele</GroupLabel>
          <CardGrid>
            <CardButton
              v-for="tc in realisticTests"
              :key="tc.id"
              :label="tc.label"
              :desc="tc.desc"
              @click="tc.fn()" />
          </CardGrid>
        </div>
      </section>

      <!-- ==================== TOASTS ==================== -->
      <section class="mb-16 animate-fade-up" style="animation-delay: 150ms">
        <SectionHeader
          title="Toasts"
          subtitle="Ersetzt Ionic toastController + CommandBus"
          accent="bg-emerald-500" />

        <!-- Typen: colored chips -->
        <div class="mb-8">
          <GroupLabel>Typen</GroupLabel>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="t in toastTypeTests"
              :key="t.id"
              class="rounded-lg border px-4 py-3 text-[13px] font-medium transition-all hover:brightness-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 active:scale-[0.98]"
              :class="t.chipClass"
              @click="t.fn()">
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- Positionen: 2x2 grid -->
        <div class="mb-8">
          <GroupLabel>Positionen</GroupLabel>
          <div class="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200">
            <button
              v-for="pos in positions"
              :key="pos"
              class="bg-white px-4 py-3 text-center text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
              @click="toast.info(`Toast at ${pos}`, { position: pos })">
              {{ pos }}
            </button>
          </div>
        </div>

        <!-- Features -->
        <div class="mb-8">
          <GroupLabel>Features</GroupLabel>
          <CardGrid>
            <CardButton
              v-for="tc in toastFeatureTests"
              :key="tc.id"
              :label="tc.label"
              :desc="tc.desc"
              @click="tc.fn()" />
          </CardGrid>
        </div>

        <!-- Layering -->
        <div>
          <GroupLabel>Layering</GroupLabel>
          <CardGrid>
            <CardButton
              v-for="tc in toastLayeringTests"
              :key="tc.id"
              :label="tc.label"
              :desc="tc.desc"
              @click="tc.fn()" />
          </CardGrid>
        </div>
      </section>

      <!-- ==================== DATEPICKER ==================== -->
      <section class="animate-fade-up" style="animation-delay: 250ms">
        <SectionHeader
          title="DatePicker"
          subtitle="Lokalisierung, Min/Max, Validation, Range"
          accent="bg-violet-500" />
        <DatePickerDemo />
      </section>
    </main>

    <!-- Drawer for layering test -->
    <DrawerRoot
      :open="drawerOpen"
      @update:open="(v: boolean) => (drawerOpen = v)">
      <DrawerPortal>
        <DrawerOverlay class="fixed inset-0 bg-black/40" />
        <DrawerContent
          class="fixed right-0 bottom-0 left-0 flex max-h-[96dvh] flex-col rounded-t-2xl bg-white">
          <div class="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
          <div class="flex shrink-0 items-center justify-between px-4 pt-2 pb-2">
            <DrawerTitle class="text-lg font-semibold">Drawer (Layering-Test)</DrawerTitle>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
              @click="drawerOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <DrawerDescription class="sr-only">Drawer for testing toast layering</DrawerDescription>
          <div class="p-4">
            <p class="mb-4 text-gray-600">Der Toast muss über diesem Drawer sichtbar sein.</p>
            <button
              class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
              @click="toast.info('Fired from inside the drawer!')">
              Toast auslösen
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
    DrawerContent, DrawerDescription, DrawerOverlay,
    DrawerPortal, DrawerRoot, DrawerTitle
  } from './lib/vaul-vue';
  import { defineComponent, h, ref } from 'vue';
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
  import AddressFlow from './demos/modal/examples/address-flow/AddressFlow.vue';
  import UndismissableContent from './demos/modal/examples/UndismissableContent.vue';
  import ResponsiveModal from './demos/modal/ResponsiveModal.vue';
  import { showModal, type ModalSize } from './demos/modal/useModal';
  import ToastContainer from './demos/toast/ToastContainer.vue';
  import { useToast, type ToastPosition } from './demos/toast/useToast';

  // Inline sub-components to reduce template noise
  const SectionHeader = defineComponent({
    props: { title: String, subtitle: String, accent: String },
    setup(props) {
      return () => h('div', { class: 'mb-6' }, [
        h('div', { class: 'flex items-center gap-2.5 mb-1' }, [
          h('div', { class: `h-1.5 w-1.5 rounded-full ${props.accent}` }),
          h('h2', { class: 'text-xs font-semibold uppercase tracking-widest text-gray-500' }, props.title),
        ]),
        h('p', { class: 'pl-4 text-[13px] text-gray-400' }, props.subtitle),
      ]);
    },
  });

  const GroupLabel = defineComponent({
    setup(_, { slots }) {
      return () => h('h3', {
        class: 'mb-2.5 pl-0.5 text-xs font-medium uppercase tracking-wider text-gray-400'
      }, slots.default?.());
    },
  });

  const CardGrid = defineComponent({
    setup(_, { slots }) {
      return () => h('div', {
        class: 'grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200'
      }, slots.default?.());
    },
  });

  const CardButton = defineComponent({
    props: { label: String, desc: String },
    emits: ['click'],
    setup(props, { emit }) {
      return () => h('button', {
        class: 'group bg-white px-4 py-3.5 text-left transition-all hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
        onClick: () => emit('click'),
      }, [
        h('div', { class: 'flex items-baseline justify-between gap-3' }, [
          h('span', { class: 'text-[13px] font-medium text-gray-700 transition-colors group-hover:text-gray-900' }, props.label),
          h('svg', {
            class: 'h-3.5 w-3.5 shrink-0 text-gray-300 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5',
            viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
            'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          }, [h('path', { d: 'm9 18 6-6-6-6' })]),
        ]),
        props.desc
          ? h('p', { class: 'mt-0.5 text-xs leading-relaxed text-gray-500' }, props.desc)
          : null,
      ]);
    },
  });

  const toast = useToast();
  const drawerOpen = ref(false);
  const positions: ToastPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  async function openModal(options: Parameters<typeof showModal>[0], label?: string) {
    const result = await showModal(options);
    console.log(`[Modal] ${label ?? 'Modal'}`, result);
  }

  // ── Modal Tests ──────────────────────────────────────

  const dismissTests = [
    {
      id: 'm-persistent', label: 'Persistent',
      desc: 'Swipe/Backdrop blockiert — Close + Escape gehen',
      fn: () => openModal({ component: FormContent, size: 'medium', dismissible: 'persistent' }, 'Persistent'),
    },
    {
      id: 'm-locked', label: 'Locked',
      desc: 'Komplett gesperrt — schließt nach 3s (simuliert API-Call)',
      fn: () => openModal({ component: UndismissableContent, size: 'small', dismissible: false }, 'Locked'),
    },
    {
      id: 'm-custom', label: 'Custom canDismiss',
      desc: 'Escape blockiert, Backdrop + Close erlaubt',
      fn: () => openModal({ component: BasicContent, componentProps: { title: 'Escape blocked' }, size: 'medium', canDismiss: r => r !== 'escape' }, 'Custom'),
    },
  ];

  const featureTests = [
    {
      id: 'm-form', label: 'Formular mit Rückgabewert',
      desc: 'Speichern → Daten zurück, Backdrop blockiert bei Änderungen',
      fn: () => openModal({ component: FormContent, size: 'medium', dismissible: 'persistent' }, 'Form'),
    },
    {
      id: 'm-scroll', label: 'Scrollbarer Inhalt (AGB)',
      desc: 'Langer Text mit Scroll-Indikatoren',
      fn: () => openModal({ component: ScrollContent, size: 'medium' }, 'Scroll'),
    },
    {
      id: 'm-multistep', label: 'Multi-Step Formular',
      desc: '3 Schritte mit Fortschritt und Zurück-Button',
      fn: () => openModal({ component: MultiStepContent, size: 'medium', dismissible: 'persistent' }, 'Multi-step'),
    },
    {
      id: 'm-nested', label: 'Verschachtelte Modals',
      desc: 'Modal → Modal, verschiedene Größen, dismissAll',
      fn: () => openModal({ component: NestedContent, componentProps: { depth: 1, size: 'large' }, size: 'large' }, 'Nested'),
    },
    {
      id: 'm-lifecycle', label: 'Lifecycle Callbacks',
      desc: 'onPresent, onWillDismiss, onDidDismiss — Console',
      fn: () => openModal({
        component: BasicContent, componentProps: { title: 'Lifecycle Test' }, size: 'medium',
        onPresent: () => console.log('[Modal] onPresent'),
        onWillDismiss: () => console.log('[Modal] onWillDismiss'),
        onDidDismiss: () => console.log('[Modal] onDidDismiss'),
      }, 'Lifecycle'),
    },
    {
      id: 'm-auto', label: 'Auto Height (Confirm)',
      desc: 'Modal passt sich der Content-Höhe an',
      fn: () => openModal({
        component: ConfirmContent, size: 'small', autoHeight: true,
        componentProps: { title: 'Cancel Order?', message: 'Are you sure? This cannot be undone.', confirmLabel: 'Cancel Order' },
      }, 'Confirm'),
    },
    {
      id: 'm-toast', label: 'Toast über Modal',
      desc: 'Toast muss über dem Modal erscheinen',
      fn: () => { showModal({ component: BasicContent, componentProps: { title: 'Toast should be above' }, size: 'medium' }); setTimeout(() => toast.success('I am above the modal!'), 500); },
    },
  ];

  const realisticTests = [
    {
      id: 'm-longform', label: 'Langes Formular',
      desc: '12 Felder — testet Scroll und Keyboard-Handling auf Mobile',
      fn: () => openModal({ component: LongFormContent, size: 'medium', dismissible: 'persistent' }, 'Long form'),
    },
    {
      id: 'm-cancel', label: 'Stornierung',
      desc: 'Auto-Height Confirm Dialog',
      fn: () => openModal({
        component: ConfirmContent, size: 'small', autoHeight: true,
        componentProps: { title: 'Bestellung stornieren?', message: 'Möchtest du die Bestellung wirklich stornieren?', confirmLabel: 'Stornieren' },
      }, 'Cancel'),
    },
    {
      id: 'm-product', label: 'Produkt-Quickview',
      desc: 'Bild, Mengenauswahl, Warenkorb — eigenes Layout',
      fn: () => openModal({ component: ProductContent, size: 'small' }, 'Product'),
    },
    {
      id: 'm-timeslot', label: 'Lieferzeit wählen',
      desc: 'Custom Header, Zeitslots mit Preisen',
      fn: () => openModal({ component: TimeslotContent, size: 'small', dismissible: 'persistent' }, 'Timeslot'),
    },
    {
      id: 'm-address', label: 'Adress-Flow (NavStack)',
      desc: 'Root → Suche → Karte, Slide-Animation',
      fn: () => openModal({ component: AddressFlow, size: 'medium', dismissible: 'persistent' }, 'Address'),
    },
  ];

  // ── Toast Tests ──────────────────────────────────────

  const toastTypeTests = [
    { id: 't-success', label: 'Success', chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100', fn: () => toast.success('Operation completed successfully.') },
    { id: 't-error', label: 'Error', chipClass: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100', fn: () => toast.error('Something went wrong.', { duration: 0 }) },
    { id: 't-warning', label: 'Warning', chipClass: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100', fn: () => toast.warning('Session expires in 5 minutes.') },
    { id: 't-info', label: 'Info', chipClass: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100', fn: () => toast.info('A new version is available.') },
  ];

  const toastFeatureTests = [
    { id: 't-title', label: 'Mit Titel', desc: 'Toast mit Headline', fn: () => toast.error('Server returned 500.', { title: 'Server Error', duration: 0 }) },
    { id: 't-action', label: 'Mit Action-Button', desc: 'Klickbare Aktion', fn: () => toast.error('Failed to save.', { action: { label: 'Retry', onClick: () => toast.success('Retried!', { position: 'top-right' }) }, duration: 0 }) },
    { id: 't-dismiss', label: 'onDismiss Callback', desc: 'Console bei Dismiss', fn: () => toast.info('Dismiss me — check console.', { onDismiss: () => console.log('[Toast] onDismiss') }) },
    { id: 't-html', label: 'HTML Message', desc: 'Formatiert mit <br> und <b>', fn: () => toast.success('Nächste Lieferzeit:<br>in <b>15 Min</b> oder Wunschtermin.') },
    { id: 't-short', label: 'Kurze Duration (3s)', desc: 'Auto-Close nach 3s', fn: () => toast.info('Verschwindet in 3 Sekunden.', { duration: 3000 }) },
  ];

  const toastLayeringTests = [
    { id: 't-4', label: 'Alle 4 Ecken', desc: 'Simultane Toasts', fn: () => { toast.success('Top left', { position: 'top-left' }); toast.error('Top right', { position: 'top-right' }); toast.warning('Bottom left', { position: 'bottom-left' }); toast.info('Bottom right', { position: 'bottom-right' }); } },
    { id: 't-replace', label: 'Replace', desc: 'Zweiter ersetzt ersten', fn: () => { toast.info('Wird ersetzt…', { duration: 0 }); setTimeout(() => toast.success('Ersetzt!'), 500); } },
    { id: 't-drawer', label: 'Toast über Drawer', desc: 'Toast über Sheet', fn: () => { drawerOpen.value = true; setTimeout(() => toast.success('Über dem Drawer!'), 600); } },
  ];
</script>
