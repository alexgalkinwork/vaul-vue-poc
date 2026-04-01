# ModalNavStack — Implementation Guide

## Übersicht

Stack-basierte Navigation innerhalb von Modals. Ersetzt Ionic's `ion-nav`. Seiten werden gepusht/gepoppt mit Slide-Animationen, Back-Button erscheint automatisch.

```
src/demos/modal/
  useNavStack.ts         ← State + API (createNavStack, useNavStack)
  ModalNavStack.vue      ← Rendering (Header + Transition + aktive Page)
```

## Wie benutzt man es?

### 1. Flow-Component erstellen

Die Flow-Component ist der Einstiegspunkt. Sie benutzt `ModalNavStack` statt `ModalTemplate`:

```vue
<!-- AddressFlow.vue -->
<template>
  <ModalNavStack :root="AddressInputPage" root-title="Lieferadresse" />
</template>

<script setup lang="ts">
  import ModalNavStack from '../../ModalNavStack.vue';
  import AddressInputPage from './AddressInputPage.vue';
</script>
```

Mehr braucht die Flow-Component nicht. `ModalNavStack` rendert automatisch:
- Header mit Titel der aktiven Page + Back-Button (wenn Stack > 1) + ModalClose
- Die aktive Page mit Slide-Animation

### 2. Modal öffnen

```ts
const result = await showModal({
  component: AddressFlow,
  size: 'medium',
  dismissible: 'persistent',
})
```

Kein spezielles Flag — die Flow-Component entscheidet selbst dass sie `ModalNavStack` benutzt.

### 3. In Pages navigieren

Pages injecten die NavStack-API:

```ts
import { useNavStack } from '../../useNavStack'

const nav = useNavStack()

nav.push(SearchPage, { title: 'Adresse suchen' })
nav.push(MapPage, { title: 'Auf Karte wählen', props: { lat: 52.52 } })
nav.pop()        // eine Seite zurück
nav.popToRoot()  // alles bis auf Root-Page entfernen
```

### 4. Flow abschließen

Wenn der User den Flow beendet, dismissed die Page das gesamte Modal:

```ts
import { dismiss } from '../../useModal'

dismiss({ address: selectedAddress }, 'confirm')
```

---

## Wie funktioniert es unter der Haube?

### useNavStack.ts

#### NavEntry

```ts
interface NavEntry {
  component: Component   // die Vue-Component der Page
  title: string          // wird im Header angezeigt
  props?: Record<string, unknown>  // Props für die Component
}
```

Jeder Eintrag im Stack ist eine NavEntry. Root ist immer `[0]`, aktive Page ist immer die letzte.

#### createNavStack()

Erstellt einen neuen NavStack mit einer Root-Page. Wird von `ModalNavStack.vue` aufgerufen:

```ts
const nav = createNavStack(AddressInputPage, 'Lieferadresse')
```

Intern: ein `shallowRef<NavEntry[]>` als Stack, plus computed Properties und Mutations-Funktionen.

**`push(component, { title, props? })`** — setzt `direction` auf `'forward'`, hängt neue NavEntry ans Array.

**`pop()`** — setzt `direction` auf `'back'`, entfernt letzten Eintrag. Tut nichts wenn nur Root da ist.

**`popToRoot()`** — setzt `direction` auf `'back'`, behält nur `[0]`. Für "Alles zurück" nach einer tiefen Navigation (z.B. Map → Root).

**`canGoBack`** — `computed(() => stack.length > 1)`. Steuert den Back-Button.

**`currentTitle`** — `computed(() => activeEntry.title)`. Steuert den Header-Titel.

**`direction`** — `'forward' | 'back'`. Steuert die Animations-Richtung. Push = forward (Slide von rechts), Pop = back (Slide von links).

#### useNavStack()

Inject-Wrapper für Pages. Wirft einen Error wenn außerhalb von `ModalNavStack` benutzt:

```ts
const nav = useNavStack()  // in einer Page-Component
nav.push(SearchPage, { title: 'Suche' })
```

### ModalNavStack.vue

Erstellt den NavStack via `createNavStack()`, provided ihn per `provide(NAV_STACK_KEY)`, und rendert:

```
┌─ Header ────────────────────────────┐
│  [← Back]   {{ currentTitle }}  [X] │
├─────────────────────────────────────┤
│  <Transition :name="direction">    │
│    <ActivePage :key="stackDepth" /> │
│  </Transition>                      │
└─────────────────────────────────────┘
```

- **Back-Button** — nur sichtbar wenn `canGoBack`. Ruft `nav.pop()` auf.
- **Titel** — reactive, ändert sich bei jedem Push/Pop zur `title` der neuen aktiven Page.
- **ModalClose** — automatisch, respektiert `dismissible` (wie bei ModalTemplate).
- **Transition** — richtungsabhängig. Name wechselt zwischen `nav-forward` und `nav-back` basierend auf `direction`.
- **`:key="stack.length"`** — erzwingt Re-Render bei Stack-Änderung, triggert die Transition.

### Animationen

CSS Transitions mit `mode="out-in"` (alte Page raus, dann neue rein):

**Forward (Push):** Neue Page slidet von rechts rein (+30% → 0%), alte slidet nach links raus (0% → -30%).

**Back (Pop):** Aktive Page slidet nach rechts raus (0% → +30%), darunter liegende Page slidet von links rein (-30% → 0%).

```css
.nav-forward-enter-from { transform: translateX(30%); opacity: 0; }
.nav-forward-leave-to   { transform: translateX(-30%); opacity: 0; }
.nav-back-enter-from    { transform: translateX(-30%); opacity: 0; }
.nav-back-leave-to      { transform: translateX(30%); opacity: 0; }
```

Dauer: 250ms ease. Schnell genug um nicht zu nerven, langsam genug um die Richtung wahrzunehmen.

---

## Vergleich: ion-nav vs. ModalNavStack

### ion-nav (Ionic)
```ts
const nav = document.querySelector('ion-nav') as HTMLIonNavElement
nav.push(SearchPage, { pageId: 'search', measurementId })
nav.pop()
nav.popToRoot()
nav.canGoBack()
nav.getActive()
```
- Imperativ, DOM-basiert (querySelector)
- Ionic-Dependency
- `ionNavDidChange` Event für State-Tracking
- Custom Animation Builder (JavaScript)
- Page-Components brauchen `ion-content` Wrapper

### ModalNavStack (Vue-nativ)
```ts
const nav = useNavStack()
nav.push(SearchPage, { title: 'Suche', props: { query } })
nav.pop()
nav.popToRoot()
nav.canGoBack   // computed, reactive
nav.currentTitle // computed, reactive
```
- Declarativ, Vue Composition API
- Kein Ionic
- Reactive Computeds statt Events
- CSS Transitions (kein JavaScript)
- Pages sind normale Vue Components

---

## Architektur des Address-Flow Beispiels

```
AddressFlow.vue (Flow-Component)
├── provide(ADDRESS_KEY, selectedAddress)
└── ModalNavStack (root: AddressInputPage, title: "Lieferadresse")
    │
    ├── AddressInputPage (Root)
    │   ├── Zeigt aktuelle Adresse (inject ADDRESS_KEY)
    │   ├── "Andere Adresse suchen" → nav.push(SearchPage)
    │   ├── "Auf Karte wählen" → nav.push(MapPage)
    │   └── "Adresse bestätigen" → dismiss(address, 'confirm')
    │
    ├── AddressSearchPage (pushed)
    │   ├── Suchfeld + Ergebnisliste
    │   └── Adresse wählen → address.value = ... → nav.pop()
    │       → zurück zu Root, Root zeigt neue Adresse
    │
    └── AddressMapPage (pushed)
        ├── Karten-Placeholder + gewählte Position
        └── "Standort bestätigen" → address.value = ... → nav.popToRoot()
            → zurück zu Root, Root zeigt neue Adresse
```

Dateien:
```
examples/address-flow/
  AddressFlow.vue        ← Flow-Component (ModalNavStack + provide)
  AddressInputPage.vue   ← Root-Page (Adresse anzeigen, Navigation starten)
  AddressSearchPage.vue  ← Such-Page (Ergebnisliste, Auswahl → pop)
  AddressMapPage.vue     ← Karten-Page (Standort wählen → popToRoot)
  addressState.ts        ← Shared Types + InjectionKey
```
