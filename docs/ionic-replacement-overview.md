# Ionic-Ersatz: Reka UI + vaul-vue

> POC-Ergebnisse und Migrations-Guide für Entwickler

Live-Demo: https://alexgalkinwork.github.io/vaul-vue-poc/

---

## Warum ersetzen wir Ionic?

Ionic wird bei uns ausschließlich für 4 Features genutzt: **Modals**, **Toasts**, **Sheets** und **Navigation innerhalb von Modals**. Der gesamte Rest unserer App ist Vue 3 + Tailwind. Das führt zu Reibung:

| Problem | Beispiel |
|---------|----------|
| **Eigener Lifecycle** | `onPresent`, `onWillDismiss` statt Vue's `onMounted`/`onUnmounted` |
| **Shadow DOM** | Ionic-Components kapseln ihre Styles → CSS-Overrides mit `::part()` und `--ion-*` Variables |
| **CommandBus für Toasts** | `CommandBus.send('toast/error', {...})` statt direkter Funktionsaufruf |
| **Responsive-Boilerplate** | `smallerThanXL.value ? [0, 1] : undefined` in jeder Modal-Funktion |
| **Bundle-Size** | ~200KB+ für das Ionic Framework, davon nutzen wir ~5% |

## Was nutzen wir stattdessen?

| Library | Größe | Was sie tut |
|---------|-------|-------------|
| [reka-ui](https://reka-ui.com) (ehem. Radix Vue) | ~30KB | Unstyled, accessible UI-Primitives (Dialog, Toast, DatePicker) |
| [vaul-vue](https://github.com/unovue/vaul-vue) | ~15KB | Bottom Sheets mit Swipe-to-dismiss |

Beide sind **headless** — kein eigenes Styling, alles Tailwind. Kein Shadow DOM, keine CSS-Konflikte.

---

## Die 4 Systeme im Überblick

### 1. Responsive Modals

**Ersetzt:** `ion-modal` + `modalController` + `smallerThanXL` Logik

Ein `showModal()` Aufruf — das System entscheidet automatisch ob Dialog (Desktop ≥ 1200px) oder Sheet (Mobile):

```ts
import { showModal } from './useModal'

const { data, role } = await showModal({
  component: LoginForm,
  componentProps: { redirect: '/account' },
  size: 'medium',
  dismissible: 'persistent',
})

if (role === 'success') {
  router.push(data.redirect)
}
```

#### Vorher → Nachher

```ts
// VORHER (Ionic)
await showModal({
  component: LoginModal,
  breakpoints: smallerThanXL.value ? [0, 1] : undefined,
  initialBreakpoint: smallerThanXL.value ? 1 : undefined,
  cssClass: ['small', smallerThanXL.value ? '' : 'auto_height'],
  backdropDismiss: false,
  handle: false,
  canDismiss: (data, role) => role !== 'gesture',
})

// NACHHER
await showModal({
  component: LoginForm,
  size: 'small',
  dismissible: 'persistent',
})
```

#### Optionen

```ts
interface ModalOptions {
  component: Component               // Die Content-Component
  componentProps?: Record<string, unknown>  // Props für die Component

  size?: 'small' | 'medium' | 'large'  // Desktop-Breite: 438px | 672px | 1140px
  autoHeight?: boolean                  // Höhe passt sich Content an (Confirm-Dialoge)
  dismissible?: true | 'persistent' | false  // Dismiss-Verhalten (siehe unten)
  canDismiss?: (reason: DismissReason) => boolean  // Custom-Logik

  onPresent?: () => void        // Nach Enter-Animation (Tracking, Fokus)
  onWillDismiss?: () => void    // Vor dem Schließen (State sichern)
  onDidDismiss?: () => void     // Nach dem Schließen (Cleanup)
}
```

#### Das `dismissible` System

Ersetzt 5 einzelne Ionic-Flags durch ein Property:

| Modus | Handle | Close | Escape | Backdrop | Swipe | Use Case |
|-------|--------|-------|--------|----------|-------|----------|
| `true` | ja | ja | ja | ja | ja | Standard-Modals |
| `'persistent'` | nein | ja | ja | nein | nein | Formulare, Auth |
| `false` | nein | nein | nein | nein | nein | Loading, Payment |

#### Dismiss-Gründe

Ionic: `role !== 'gesture'` (Magic Strings, undokumentiert welche es gibt)
Neu: Typisierter Union-Type:

```ts
type DismissReason = 'escape' | 'backdrop' | 'swipe' | 'close-button' | 'programmatic'
```

#### Innerhalb eines Modals

```ts
import { dismiss, dismissAll } from './useModal'

// Oberstes Modal schließen mit Ergebnis
dismiss({ submitted: true }, 'success')

// Oberstes Modal abbrechen
dismiss(null, 'cancel')

// Gesamten Stack schließen (z.B. nach erfolgreichem Multi-Step Flow)
dismissAll()
```

#### Modal-Stacking

Modals können weitere Modals öffnen. Jedes bekommt eigenen z-index (100, 110, 120...). Nur das erste Modal hat einen Backdrop-Dimmer — gestackte Modals haben transparente Overlays mit schwerem Box-Shadow (kein kumulatives Abdunkeln).

```ts
// Im NestedContent.vue
const result = await showModal({
  component: EditForm,
  size: 'small',  // Kleineres Modal über dem großen
})
```

#### Setup in der App

```vue
<!-- App.vue -->
<template>
  <div id="app-root">
    <router-view />
    <ResponsiveModal />
    <ToastContainer />
  </div>
</template>
```

`id="app-root"` wird für den Scroll-Lock beim Sheet-Öffnen gebraucht.

---

### 2. Navigation im Modal (NavStack)

**Ersetzt:** `ion-nav`

Für Flows die aus mehreren Seiten bestehen (Adress-Auswahl → Suche → Karte → Lieferhinweis):

#### Flow-Component

```vue
<!-- AddressFlow.vue -->
<template>
  <ModalNavStack :root="AddressInputPage" root-title="Lieferadresse" />
</template>

<script setup lang="ts">
  import ModalNavStack from '../../ModalNavStack.vue'
  import AddressInputPage from './AddressInputPage.vue'
</script>
```

Das ist die gesamte Flow-Component. `ModalNavStack` rendert automatisch:
- Header mit Titel der aktiven Page
- Back-Button (wenn Stack > 1)
- Close-Button (respektiert `dismissible`)
- Aktive Page mit iOS-Style Slide-Animation

#### In Pages navigieren

```ts
import { useNavStack } from '../../useNavStack'

const nav = useNavStack()

// Neue Page pushen
nav.push(SearchPage, { title: 'Adresse suchen', props: { query: 'Berlin' } })

// Zurück
nav.pop()

// Alles zurück bis Root
nav.popToRoot()

// Reactive State
nav.canGoBack     // ComputedRef<boolean> — steuert Back-Button
nav.currentTitle  // ComputedRef<string> — steuert Header-Titel
```

#### Daten zwischen Pages teilen

Pages sind normale Vue-Components. State teilen geht wie gewohnt:

**Option A: provide/inject (Component-scoped)**
```ts
// In AddressFlow.vue
const address = ref<Address>({ street: 'Musterstr. 42', city: 'Berlin' })
provide(ADDRESS_KEY, address)

// In jeder Page
const address = inject(ADDRESS_KEY)!
address.value = { street: 'Neue Str. 1', city: 'Hamburg' }
```

**Option B: Pinia Store (global)**
```ts
// useAddressFlowStore.ts
export const useAddressFlowStore = defineStore('addressFlow', () => {
  const address = ref<Address>({ ... })
  return { address }
})

// In jeder Page
const store = useAddressFlowStore()
```

Die Wahl liegt beim Entwickler — der NavStack ist agnostisch.

#### Vorher → Nachher

```ts
// VORHER (ion-nav)
const nav = document.querySelector('ion-nav') as HTMLIonNavElement
nav.push(SearchPage, { pageId: 'search', measurementId })
nav.pop()

// NACHHER
const nav = useNavStack()
nav.push(SearchPage, { title: 'Suche', props: { query } })
nav.pop()
```

---

### 3. Toasts

**Ersetzt:** Ionic `toastController` + `CommandBus`

```ts
import { useToast } from './useToast'

const toast = useToast()

toast.success('Gespeichert!')
toast.error('Verbindung fehlgeschlagen', {
  duration: 0,
  action: { label: 'Erneut versuchen', onClick: () => retry() },
})
toast.warning('Session läuft in 5 Minuten ab')
toast.info('Neue Version verfügbar', { position: 'top-right' })
```

#### Vorher → Nachher

```ts
// VORHER
CommandBus.send<Toast.Error>('toast/error', {
  message: 'Fehler',
  autoClose: false,
})

// NACHHER
toast.error('Fehler', { duration: 0 })
```

#### Features

| Feature | Details |
|---------|---------|
| **4 Typen** | `success`, `error`, `warning`, `info` |
| **4 Positionen** | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| **Replace-Logik** | Max 1 Toast pro Position — neuer ersetzt alten |
| **Action-Buttons** | `{ label: 'Retry', onClick: fn }` |
| **HTML-Messages** | `'Zeile 1<br><b>Wichtig</b>'` via `v-html` |
| **onDismiss** | Callback wenn Toast geschlossen wird |
| **Über Modals** | z-110, korrekte pointer-events |

#### Optionen

```ts
interface ToastOptions {
  title?: string                  // Headline über der Message
  duration?: number               // ms bis auto-close (default: 10000, 0 = persistent)
  position?: ToastPosition        // Ecke (default: 'bottom-right')
  action?: {                      // Action-Button
    label: string
    onClick: () => void
  }
  onDismiss?: () => void          // Callback bei Close
}
```

#### Funktioniert überall

Kein CommandBus, kein `inject`, kein Component-Context nötig:

```ts
// In einem Service
import { useToast } from './useToast'
const toast = useToast()

export async function addToCart(productId: string) {
  try {
    await api.post(`/cart/${productId}`)
    toast.success('Zum Warenkorb hinzugefügt')
  } catch {
    toast.error('Fehler beim Hinzufügen')
  }
}
```

---

### 4. DatePicker

**Nicht direkt Ionic-Ersatz** — evaluiert reka-ui's DatePicker als mögliche Standard-Component.

```vue
<DatePicker
  v-model="deliveryDate"
  locale="de-DE"
  :min-value="today"
  :is-date-disabled="isWeekend"
  placeholder="Lieferdatum wählen"
/>

<DateRangePicker
  v-model="vacationRange"
  locale="de-DE"
  :number-of-months="2"
  placeholder="Zeitraum wählen"
/>
```

Features:
- Deutsche Lokalisierung
- Monat/Jahr per Dropdown wählbar (kein 100x klicken um zu 1990 zu kommen)
- Min/Max, deaktivierte/unveverfügbare Tage
- Custom Validation mit Fehlermeldungen
- Responsive: Desktop → Popover, Mobile → Sheet
- Range-Picker mit 2 Monaten

---

## Content-Components erstellen

Jedes Modal braucht eine Content-Component. Das Standard-Layout nutzt `ModalTemplate`:

```vue
<!-- MyFormModal.vue -->
<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Formular" />
    </template>

    <div class="p-4 space-y-4">
      <input v-model="name" type="text" placeholder="Name" />
      <textarea v-model="note" placeholder="Anmerkung" />
    </div>

    <template #footer>
      <div class="flex gap-2 p-4">
        <button @click="dismiss(null, 'cancel')">Abbrechen</button>
        <button @click="dismiss({ name, note }, 'success')">Speichern</button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { dismiss } from './useModal'
  import ModalTemplate from './ModalTemplate.vue'
  import ModalHeader from './ModalHeader.vue'

  const name = ref('')
  const note = ref('')
</script>
```

### ModalTemplate Struktur

```
┌─ #header Slot ──────────────────────────┐
│  ModalHeader (Titel, Back, Close)        │ ← shrink-0, sticky
│  ─── Scroll-Indikator (Linie) ─────     │ ← erscheint bei Scroll
├──────────────────────────────────────────┤
│  Default Slot (Body)                     │ ← flex-1, overflow-y: auto
│  Dein Content hier                       │
├──────────────────────────────────────────┤
│  ─── Scroll-Indikator (Linie) ─────     │ ← verschwindet am Ende
│  #footer Slot                            │ ← shrink-0, sticky
└──────────────────────────────────────────┘
```

- **Scroll-Indikatoren:** Header bekommt einen Shadow wenn Content gescrollt wurde, Footer verliert seinen Shadow wenn man am Ende ist.
- **Close-Button:** Erscheint automatisch im Header. Verschwindet automatisch bei `dismissible: false` (via provide/inject).
- **Kein ModalTemplate nötig** für komplett custom Layouts (z.B. Produkt-Quickview mit Bild als Header).

### ModalHeader Props

| Prop | Type | Default | Beschreibung |
|------|------|---------|-------------|
| `title` | `string` | — | Titel-Text |
| `backButton` | `boolean` | `false` | Zurück-Pfeil links |

Close-Button: automatisch via `inject(MODAL_DISMISSIBLE_KEY)`.

---

## Architektur

### Dateistruktur

```
src/
  lib/
    vaul-vue/               ← Lokale Kopie (mit iOS Safari Fixes)
  demos/
    modal/
      useModal.ts           ← API: showModal(), dismiss(), dismissAll()
      ResponsiveModal.vue   ← Rendering (1x im App-Root mounten)
      ModalDialog.vue       ← Desktop-Variante (reka-ui Dialog)
      ModalSheet.vue        ← Mobile-Variante (vaul-vue Drawer)
      ModalTemplate.vue     ← Layout: Header + scrollbarer Body + Footer
      ModalHeader.vue       ← Standard-Header mit Titel/Back/Close
      ModalClose.vue        ← Close-Button (dismissible-aware)
      ModalNavStack.vue     ← Stack-Navigation innerhalb von Modals
      useNavStack.ts        ← NavStack API: push(), pop(), popToRoot()
      examples/             ← Demo Content-Components
    toast/
      useToast.ts           ← API: success(), error(), warning(), info()
      ToastContainer.vue    ← Rendering (1x im App-Root mounten)
    datepicker/
      DatePicker.vue        ← Single-Date mit Kalender
      DateRangePicker.vue   ← Range mit 2 Monaten
```

### Was macht reka-ui / vaul-vue vs. was machen wir?

| Feature | Library | Wir |
|---------|---------|-----|
| Dialog-Rendering + Portal | reka-ui | — |
| Focus-Trapping (Dialog) | reka-ui | — |
| Escape schließt Dialog | reka-ui | — |
| Swipe-to-dismiss (Sheet) | vaul-vue | — |
| Sheet-Animation | vaul-vue | — |
| ARIA / Screen Reader | reka-ui | — |
| Toast Timer + Swipe | reka-ui | — |
| **Responsive Switch** | — | automatisch Sheet ↔ Dialog |
| **Modal Stack** | — | showModal/dismiss/dismissAll |
| **dismissible System** | — | 3 Modi statt 5 Flags |
| **Typisierte Dismiss-Gründe** | — | DismissReason Union Type |
| **Promise-basierte API** | — | await showModal() |
| **NavStack** | — | push/pop/popToRoot |
| **Toast Composable** | — | useToast() statt CommandBus |
| **4-Ecken-Positioning** | — | 4 Provider pro Ecke |
| **Layering über Modals** | — | z-index + pointer-events |

---

## iOS Safari Fixes

Wir haben eine **lokale Kopie** von vaul-vue unter `src/lib/vaul-vue/` mit folgenden Fixes:

| Problem | Lösung |
|---------|--------|
| Address-Bar expandiert beim Sheet-Öffnen | `noBodyStyles` auf DrawerRoot — vaul-vue fasst den Body nicht an |
| Seite scrollt hinter dem Sheet | `overflow: hidden` + `touch-action: none` auf dem Wrapper |
| 1px Gap zwischen NavStack-Pages | `backface-visibility: hidden` + `translateZ(0)` auf dem Drawer |
| Scroll-Position geht verloren nach Sheet-Close | Scroll-Position wird gespeichert und restored |

Die lokale Kopie ist **fast identisch** mit dem Original — nur 2 unused Variablen wurden entfernt. Alle Fixes sind CSS/Props-basiert, kein vaul-vue Source geändert.

---

## Bekannte Limitations

| Issue | Status | Impact |
|-------|--------|--------|
| `aria-hidden` Chrome-Warnung beim Modal-Öffnen | [reka-ui #1280](https://github.com/unovue/reka-ui/issues/1280) | Nur Console, keine funktionale Auswirkung |
| DatePicker Segment-Eingabe validiert nicht live gegen min/max | Design-Entscheidung von reka-ui | Post-Validation nach Eingabe |
| iOS Keyboard-Gap bei Inputs in Sheets | [vaul #503](https://github.com/emilkowalski/vaul/issues/503) | Minimiert durch CSS, nicht 100% eliminiert |

---

## Migration: Schritt für Schritt

### 1. Dependencies

```bash
npm install reka-ui
# vaul-vue als lokale Kopie (wegen iOS Fixes)
```

### 2. App-Root einrichten

```vue
<template>
  <div id="app-root">
    <router-view />
    <ResponsiveModal />
    <ToastContainer />
  </div>
</template>
```

### 3. Modals migrieren

Für jedes Modal:

1. **`showModal()`-Aufruf vereinfachen:** Responsive-Logik (`smallerThanXL`, `breakpoints`, `initialBreakpoint`) entfällt komplett. `cssClass` wird zu `size`. `backdropDismiss` + `handle` + `canDismiss` wird zu `dismissible`.

2. **Content-Component:** `<ModalTemplate>` statt Ionic's `<ion-content>`. `<ModalHeader>` statt eigenem Header. `dismiss()` importieren statt `modalController.dismiss()`.

3. **Testen:** Sheet-Verhalten auf Mobile, Dialog auf Desktop. Dismiss-Modi. Keyboard-Verhalten bei Formularen.

### 4. Toasts migrieren

1. `CommandBus.send('toast/...', ...)` durch `toast.success/error/warning/info(...)` ersetzen
2. `autoClose: false` wird zu `duration: 0`
3. CommandBus-Handler für Toasts entfernen

### 5. Navigation migrieren

1. `ion-nav` durch `ModalNavStack` ersetzen
2. `nav.push(Page, { pageId })` wird zu `nav.push(Page, { title: '...' })`
3. `ionNavDidChange` Events durch reactive Computeds ersetzen (`canGoBack`, `currentTitle`)

---

## FAQ

**Brauchen wir Feature Flags?**
Ja. Modal und Toast sind zentrale Infrastruktur. Migration hinter `FF_REMOVE_IONIC` mit schrittweiser Umstellung pro Modul.

**Können alte und neue Modals gleichzeitig existieren?**
Ja. `showModal()` und Ionic's `modalController` arbeiten unabhängig. Während der Migration können beide koexistieren.

**Was passiert mit Ionic's CSS?**
Kann entfernt werden sobald alle Ionic-Components migriert sind. Bis dahin bleibt es.

**Wie groß ist der Aufwand?**
~71 Modal-Funktionen, ~87 Toast-Aufrufe im Webshop. Pro Modal: 5-15min (meistens Imports + Props ändern). Komplexere Modals mit Custom-Layouts: 30-60min.

**Was ist mit Unit Tests?**
`showModal()` gibt ein Promise zurück → testbar mit `await`. `useToast()` ist ein einfacher State-Container → testbar ohne DOM. `useNavStack()` ist pure Logik → testbar ohne Components.
