# Responsive Modal System — Implementation Guide

## Übersicht

Responsive Modal-System das auf Mobile (< 1200px) ein Bottom Sheet (vaul-vue) und auf Desktop (≥ 1200px) einen zentrierten Dialog (Reka UI) rendert. Eine API für beides.

```
src/demos/modal/
  useModal.ts              ← State + API (das was du importierst)
  ResponsiveModal.vue      ← Rendering (einmal im App-Root mounten)
  ModalTemplate.vue        ← Layout-Wrapper für Modal-Content (Header/Body/Footer)
  ModalHeader.vue          ← Standard-Header mit Titel, Back- und Close-Button
  modal-implementation.md  ← diese Datei
```

## Wie benutzt man es?

### Modal öffnen

```ts
import { showModal } from './useModal'

const { data, role } = await showModal({
  component: LoginForm,
  componentProps: { redirect: '/account' },
  size: 'medium',
})

if (role === 'success') {
  // User hat erfolgreich submitted
}
```

### Alle Optionen

```ts
await showModal({
  component: LoginForm,
  componentProps: { redirect: '/account' },

  size: 'medium',       // 'small' (438px) | 'medium' (672px) | 'large' (1140px)
  autoHeight: true,      // Content-basierte Höhe statt festes max-height
  dismissible: true,     // true | 'persistent' | false (siehe unten)
  canDismiss: reason => reason !== 'escape',  // Custom-Logik für Edge Cases

  onPresent: () => track(),        // nach Enter-Animation
  onWillDismiss: () => save(),     // vor dem Entfernen
  onDidDismiss: () => cleanup(),   // nach dem Entfernen
})
```

### Innerhalb eines Modals

```ts
import { dismiss, dismissAll } from './useModal'

dismiss({ submitted: true }, 'success')  // schließt oberstes Modal
dismiss(null, 'cancel')                  // schließt ohne Daten
dismissAll()                             // schließt den gesamten Stack
```

### Setup

`ResponsiveModal` einmal im App-Root mounten:

```vue
<template>
  <div>
    <router-view />
    <ResponsiveModal />
    <ToastContainer />
  </div>
</template>
```

---

## Das `dismissible` System

Statt vieler einzelner Flags (`preventEscapeDismiss`, `preventSwipeDismiss`, `preventBackdropDismiss`, `showHandle`, `backdropDismiss`) gibt es ein einziges `dismissible` Property mit 3 Modi:

| | Handle | Close-Button | Escape | Backdrop | Swipe |
|---|---|---|---|---|---|
| `true` (default) | ✓ | ✓ | ✓ | ✓ | ✓ |
| `'persistent'` | ✗ | ✓ | ✓ | ✗ | ✗ |
| `false` | ✗ | ✗ | ✗ | ✗ | ✗ |

**`true`** — Normal. Alles offen. Für die meisten Modals.

**`'persistent'`** — Für Formulare und wichtige Flows. Kein versehentliches Schließen durch Swipe oder Backdrop-Click. User kann aber bewusst über Close-Button oder Escape schließen. Kein Drag-Handle (weil Swipe eh nicht geht).

**`false`** — Locked. Nur programmatisch schließbar (z.B. `dismiss()` nach API-Call). Kein Close-Button, kein Handle, keine Gesten. Für Loading-States und blockierende Operationen.

### Wie der Close-Button automatisch verschwindet

`ResponsiveModal` wrapped den Content in einen `ModalDismissibleProvider` der den `dismissible`-Wert per `provide()` nach unten gibt. `ModalHeader` liest ihn per `inject()` und versteckt den Close-Button automatisch wenn `dismissible === false`. Content-Components müssen nichts manuell steuern.

### Was ist `MODAL_DISMISSIBLE_KEY`?

```ts
export const MODAL_DISMISSIBLE_KEY: InjectionKey<Dismissible> =
  Symbol('modal-dismissible');
```

Das ist Vue's typisierter provide/inject Mechanismus:

- `Symbol('modal-dismissible')` — ein eindeutiger Key. `Symbol` garantiert dass kein anderer Code versehentlich denselben Key benutzt (im Gegensatz zu Strings die kollidieren können).
- `InjectionKey<Dismissible>` — ein Vue-Typ der sagt "wenn du mit diesem Key `inject()` machst, bekommst du einen `Dismissible` Wert zurück". Gibt TypeScript-Safety beim `inject()`.

**provide-Seite** (in `ResponsiveModal.vue`):
```ts
provide(MODAL_DISMISSIBLE_KEY, props.dismissible)
```

**inject-Seite** (in `ModalHeader.vue`):
```ts
const dismissible = inject(MODAL_DISMISSIBLE_KEY, true)
// TypeScript weiß: dismissible ist vom Typ Dismissible (true | 'persistent' | false)
```

Ohne `InjectionKey` müsste man `inject('modal-dismissible')` schreiben und der Typ wäre `unknown`.

### `canDismiss` für Edge Cases

Zusätzlich zu `dismissible` gibt es `canDismiss` für Fälle die nicht in die 3 Modi passen:

```ts
showModal({
  component: MyForm,
  canDismiss: reason => reason !== 'escape',  // alles erlaubt außer Escape
})
```

`checkCanDismiss` prüft erst `dismissible`, dann `canDismiss`:

```ts
function checkCanDismiss(instance, reason) {
  const dismissible = instance.options.dismissible ?? true;
  if (dismissible === false) return false;
  if (dismissible === 'persistent') {
    if (reason === 'swipe' || reason === 'backdrop') return false;
  }
  if (instance.options.canDismiss && !instance.options.canDismiss(reason)) return false;
  return true;
}
```

---

## Wie funktioniert es unter der Haube?

### 1. useModal.ts — State + API

Technisch kein Vue-Composable (keine Lifecycle-Hooks, kein `inject`), sondern eine Factory-Funktion die reactive State + Funktionen zurückgibt. Der `use`-Prefix folgt Vue-Convention für "gibt reactive State zurück". Der Vorteil: funktioniert überall — Components, Services, plain .ts Files — weil es keine Component-Context-Abhängigkeit hat.

#### Der Modal Stack

```ts
const stack = shallowRef<ModalInstance[]>([])
```

Ein Array von offenen Modals. `shallowRef` weil wir das Array immer ersetzen (nie mutieren) — Reaktivität triggert nur bei Referenzwechsel, nicht bei deep Changes innerhalb der Objekte.

`useModal()` gibt `readonly(stack)` als `modalStack` zurück — Consumer können den Stack lesen aber nicht direkt mutieren. Änderungen gehen nur über `showModal()`, `dismiss()`, `dismissAll()`.

Jede `ModalInstance` speichert:
- `id` — eindeutig, für Vue's `:key`
- `options` — die `ModalOptions` vom Aufrufer
- `complete` — die Promise-Resolver-Funktion (wird bei Dismiss aufgerufen, resolved das Promise das `showModal()` zurückgab)
- `isDesktop` — `window.innerWidth >= 1200` zum Zeitpunkt des Öffnens

#### showModal() — Modal öffnen

```ts
function showModal<T = unknown>(options: ModalOptions): Promise<ModalResult<T>> {
  return new Promise<ModalResult<T>>(complete => {
    stack.value = [
      ...stack.value,
      {
        id: ++counter,
        options,
        complete: complete as ModalInstance['complete'],
        isDesktop: window.innerWidth >= 1200
      }
    ];
  });
}
```

1. Erstellt ein Promise das erst resolved wenn das Modal geschlossen wird
2. Der `complete` Callback wird in der Instance gespeichert — `dismiss()` ruft ihn später auf
3. Viewport wird einmalig geprüft (ändert sich nicht wenn User resized während Modal offen ist)
4. Neues Array = `shallowRef` triggert Reaktivität = `ResponsiveModal` rendert das neue Modal

Der `as ModalInstance['complete']` Cast ist nötig weil `showModal<T>` generisch ist (`complete` erwartet `ModalResult<T>`), aber `ModalInstance.complete` als `ModalResult<unknown>` typisiert ist. Der Generic `T` existiert nur an der Call-Site — die Instance speichert alles als `unknown` und der Aufrufer bekommt es typisiert zurück via das Promise.

#### dismiss() — Oberstes Modal schließen

```ts
function dismiss(data: unknown = null, role = 'dismiss') {
  const top = stack.value.at(-1);
  if (top) dismissInstance(top, data, role);
}
```

`.at(-1)` gibt das letzte Element (oberstes Modal). Content-Components rufen `dismiss(data, 'success')` auf — sie wissen nicht welche Instance sie sind, nur dass sie oben auf dem Stack liegen (was stimmt, weil der User nur mit dem obersten Modal interagieren kann).

#### dismissInstance() — Spezifische Instance schließen

```ts
function dismissInstance(instance, data = null, role = 'dismiss') {
  if (!stack.value.includes(instance)) return;

  instance.options.onWillDismiss?.();
  stack.value = stack.value.filter(i => i !== instance);
  instance.complete({ data, role });
  instance.options.onDidDismiss?.();
}
```

1. Guard: Instance muss im Stack sein (verhindert doppeltes Dismiss)
2. `onWillDismiss` Callback
3. Instance aus dem Stack filtern → neues Array → Reaktivität → Component unmountet
4. `complete()` resolved das Promise → Aufrufer kommt aus dem `await` zurück mit `{ data, role }`
5. `onDidDismiss` Callback

#### dismissAll() — Gesamten Stack leeren

```ts
function dismissAll() {
  const current = [...stack.value];
  stack.value = [];

  current.toReversed().forEach(instance => {
    instance.options.onWillDismiss?.();
    instance.complete({ data: null, role: 'dismiss-all' });
    instance.options.onDidDismiss?.();
  });
}
```

1. Kopie des Stacks erstellen (falls Callbacks neue Modals öffnen)
2. Stack leeren **bevor** Callbacks laufen (kein Zombie-State)
3. `toReversed()` (ES2023) iteriert rückwärts (oberstes zuerst) ohne das Original zu mutieren

---

### 2. ResponsiveModal.vue — Rendering

#### Responsive Switch

```html
<template v-for="(instance, index) in modalStack" :key="instance.id">
  <DialogRoot v-if="instance.isDesktop" ...>  <!-- Reka UI Dialog -->
  <DrawerRoot v-else ...>                      <!-- vaul-vue Sheet -->
</template>
```

Jede Instance im Stack wird gerendert. `isDesktop` entscheidet ob Dialog oder Sheet. Da `isDesktop` beim Öffnen gesetzt wird, bleibt ein Modal in seinem Modus auch wenn der User das Fenster resized.

#### Dismiss-Reason-Tracking

Reka UI Dialog und vaul-vue feuern beide `update:open(false)` wenn der User dismisst, aber sagen nicht **warum**. Wir tracken den Grund über separate Event-Listener:

**Dialog-Modus:**
```ts
let dialogDismissReason: DismissReason = 'backdrop';

// Reka UI feuert escape-key-down VOR update:open
@escape-key-down="() => setDialogDismissReason('escape')"
// Reka UI feuert pointer-down-outside VOR update:open
@pointer-down-outside="(e) => handlePointerDownOutside(e)"
// update:open(false) kommt als letztes → Reason ist schon gesetzt
@update:open="(val) => { if (!val) handleDialogDismiss(instance) }"
```

**Sheet-Modus:**
```ts
let sheetDismissReason: DismissReason = 'swipe';

// Overlay-Klick tracken
@pointerdown="() => setSheetDismissReason('backdrop')"
// Escape tracken
@keydown.escape="() => setSheetDismissReason('escape')"
// Default ist 'swipe' — wenn keiner der anderen feuert, war es ein Swipe
@update:open="(val) => { if (!val) handleSheetDismiss(instance) }"
```

Nach dem Auswerten wird der Reason zurückgesetzt auf den Default.

#### Z-Index Stacking

```ts
:style="{ zIndex: 100 + index * 10 }"   // Overlay
:style="{ zIndex: 101 + index * 10 }"   // Content
```

Erstes Modal: Overlay z-100, Content z-101. Zweites: z-110, z-111. Etc.

#### Backdrop bei gestackten Modals

```html
:class="index === 0 ? 'bg-black/30' : ''"
```

Nur das erste Modal bekommt einen dimming Backdrop (~32%, wie im Webshop). Gestackte Modals haben transparente Overlays (kein zusätzliches Abdunkeln) aber einen heavy Box-Shadow: `shadow-[0_28px_48px_rgba(0,0,0,0.4)]`.

#### Scrollbar-Click Prevention

Wenn der Dialog-Content scrollbar ist, kann ein Klick auf die Scrollbar `pointerDownOutside` feuern und den Dialog schließen. Wir erkennen Scrollbar-Clicks über die Position des Clicks relativ zum Element:

```ts
function handlePointerDownOutside(event) {
  const orig = event.detail?.originalEvent;
  const target = orig.target;
  if (orig.offsetX > target.clientWidth || orig.offsetY > target.clientHeight) {
    event.preventDefault();  // Scrollbar-Click → nicht schließen
    return;
  }
}
```

---

### 3. ModalTemplate.vue — Layout

Stellt die Standard-Struktur für Modal-Content bereit:

```
┌─ #header Slot (sticky, shrink-0) ──────────┐
│  (border erscheint wenn Content gescrollt)   │
├──────────────────────────────────────────────┤
│  Default Slot (scrollbar, flex-1)            │
│                                              │
├──────────────────────────────────────────────┤
│  (border erscheint wenn nicht am Ende)       │
│  #footer Slot (sticky, shrink-0)             │
└──────────────────────────────────────────────┘
```

Scroll-Indikatoren: Ein `border-gray-200` das per `:class` ein/ausgeblendet wird. `isScrolled` (Content ist gescrollt → Header-Border sichtbar) und `isAtBottom` (Content am Ende → Footer-Border unsichtbar). Getrackt über einen `@scroll` Event-Handler auf dem Scroll-Container.

---

### 4. ModalHeader.vue — Standard-Header

Props: `title` (string), `backButton` (boolean).

Close-Button-Sichtbarkeit ist **automatisch** — liest `dismissible` per `inject(MODAL_DISMISSIBLE_KEY)`. Bei `dismissible: false` wird der Close-Button nicht gerendert. Content-Components müssen nichts konfigurieren.

---

## Sizes

| Size | Desktop-Breite | Webshop-Equivalent |
|------|---------------|-------------------|
| `small` | 438px | Default-Modals |
| `medium` | 672px | CMS-Modals |
| `large` | 1140px | Maps-Modal |

Mobile: Immer full-width Sheet, `size` wird ignoriert.

`autoHeight: true` entfernt das feste `max-h-[85vh]` (Dialog) bzw. `max-h-[96dvh]` (Sheet) — Höhe richtet sich nach Content. Für kleine Confirm-Dialoge.

---

## Was macht Reka UI / vaul-vue vs. was machen wir?

| Feature | Reka UI / vaul-vue | Wir |
|---------|-------------------|-----|
| Dialog-Rendering + Portal | ✓ | - |
| Focus-Trapping (Dialog) | ✓ | - |
| Escape schließt Dialog | ✓ | - |
| Backdrop-Click schließt Dialog | ✓ | - |
| Swipe-to-dismiss (Sheet) | ✓ | - |
| Sheet-Animation | ✓ | - |
| Screen Reader (ARIA) | ✓ | - |
| Responsive Switch (Sheet ↔ Dialog) | - | ✓ |
| Modal Stack | - | ✓ |
| `dismissible` System | - | ✓ |
| Dismiss-Reason-Tracking | - | ✓ |
| Promise-basierte API | - | ✓ |
| Auto-Hide Close-Button | - | ✓ (provide/inject) |
| Scroll-Indikatoren | - | ✓ (ModalTemplate) |
| Scrollbar-Click Fix | - | ✓ |
| Z-Index Management | - | ✓ |

---

## Vergleich: Alt (Ionic) vs. Neu (Reka UI + vaul-vue)

### Alt
```ts
await showModal({
  component: LoginModal,
  breakpoints: smallerThanXL.value ? [0, 1] : undefined,
  initialBreakpoint: smallerThanXL.value ? 1 : undefined,
  cssClass: ['small', smallerThanXL.value ? '' : 'auto_height'],
  backdropDismiss: false,
  handle: false,
  canDismiss: (data, role) => role !== 'gesture',
})
```
- Responsive-Logik wiederholt sich in jeder Modal-Funktion
- CSS-Klassen statt typisierter Props
- `canDismiss` bekommt Magic Strings (`'gesture'`)
- `dismissAll()` braucht Retry-Loop wegen Ionic-Race-Conditions
- Ionic-Dependency

### Neu
```ts
await showModal({
  component: LoginForm,
  size: 'small',
  dismissible: 'persistent',
})
```
- Responsive automatisch (Sheet < 1200px, Dialog ≥ 1200px)
- Typisierte Props (`ModalSize`, `Dismissible`)
- Typisierte Dismiss-Gründe (`DismissReason`)
- `dismissAll()` ist ein `toReversed().forEach()`
- Kein Ionic, pure Vue + Reka UI + vaul-vue

---

## Known Issues

### `aria-hidden` Browser-Warnung

Chrome 128+ loggt beim Öffnen eines Modals:
> "Blocked aria-hidden on an element because its descendant retained focus"

Bekanntes offenes Issue in reka-ui: [#1280](https://github.com/unovue/reka-ui/issues/1280). Reka-ui setzt `aria-hidden="true"` auf die Seite wenn ein Dialog öffnet, aber der Button der das Modal geöffnet hat hat noch den Focus. Chrome erkennt den Konflikt.

**Impact:** Nur Console-Warnung. Keine funktionale oder A11y-Auswirkung.
**Fix:** Kommt wenn reka-ui von `aria-hidden` auf das HTML `inert` Attribut umsteigt.
