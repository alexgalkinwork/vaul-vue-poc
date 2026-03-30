# Reka UI Toast — Implementation Guide

## Übersicht

Toast-System basierend auf Reka UI als Ionic-Ersatz. Alle Dateien liegen zusammen:

```
src/demos/toast/
  useToast.ts              ← State + API (das was du importierst)
  ToastContainer.vue       ← Rendering (einmal im App-Root mounten)
  ToastDemo.vue            ← Demo-Page mit allen Test-Cases
  toast-implementation.md  ← diese Datei
```

## Wie benutzt man es?

```ts
import { useToast } from './useToast'

const toast = useToast()

toast.success('Gespeichert!')
toast.error('Fehlgeschlagen', { duration: 0 })
toast.warning('Achtung')
toast.info('Info', { position: 'top-right' })
```

### Alle Optionen

```ts
toast.success('Nachricht', {
  title: 'Überschrift',              // optional, wird fett über der Message angezeigt
  duration: 10000,                    // ms bis auto-close, 0 = bleibt stehen
  position: 'bottom-right',          // top-left | top-right | bottom-left | bottom-right
  action: { label: 'Retry', onClick: () => retry() },  // optionaler Action-Button
  onDismiss: () => doSomething(),     // Callback wenn Toast geschlossen wird
})
```

### Setup

`ToastContainer` einmal in der App-Root mounten:

```vue
<template>
  <div>
    <router-view />
    <ToastContainer />
  </div>
</template>
```

---

## Wie funktioniert es unter der Haube?

### 1. useToast.ts — State + API

#### Der globale State

```ts
const toasts = ref<ToastData[]>([])
```

Ein einfaches Array. Jeder Eintrag ist ein Toast mit einer Position. Pro Position kann nur 1 Toast existieren (max 4 gleichzeitig, einer pro Ecke).

Der State lebt **außerhalb** der `useToast()` Funktion — auf Modul-Ebene. Dadurch teilen sich alle Aufrufer denselben State. Egal ob Vue-Component, Service-File oder plain TypeScript — alle greifen auf dasselbe Array zu. Kein `provide/inject`, kein CommandBus.

#### show() — Toast anzeigen

```ts
function show(type: ToastType, message: string, options: ToastOptions = {}) {
  const position = options.position ?? DEFAULT_POSITION

  dismiss(position)

  toasts.value.push({
    id: `toast-${++counter}`,
    type,
    message,
    title: options.title,
    duration: options.duration ?? DEFAULT_DURATION,
    position,
    action: options.action,
    onDismiss: options.onDismiss,
  })
}
```

1. Position bestimmen (default: `bottom-right`)
2. Falls auf dieser Position schon ein Toast existiert → `dismiss()` aufrufen (entfernt ihn und ruft seinen `onDismiss` Callback auf)
3. Neuen Toast mit eindeutiger ID ins Array pushen

Die `id` ist wichtig für Vue's `:key` — wenn ein Toast auf derselben Position ersetzt wird, ändert sich die ID, Vue zerstört den alten DOM-Node und erstellt einen neuen. Das resettet automatisch den Reka UI Timer.

#### dismiss() — Toast entfernen

```ts
function dismiss(position: ToastPosition) {
  const existing = getByPosition(position)
  if (!existing) return

  existing.onDismiss?.()
  toasts.value = toasts.value.filter(toast => toast.position !== position)
}
```

1. Toast auf dieser Position finden
2. Falls `onDismiss` Callback gesetzt → aufrufen
3. Toast aus dem Array filtern

#### useToast() — Composable

```ts
export function useToast() {
  return {
    toasts: readonly(toasts),
    getByPosition,
    success: (message: string, options?) => show('success', message, options),
    error:   (message: string, options?) => show('error', message, options),
    warning: (message: string, options?) => show('warning', message, options),
    info:    (message: string, options?) => show('info', message, options),
    dismiss,
  }
}
```

Convenience-Wrapper. `toast.success(...)` ist kürzer als `show('success', ...)`.

`readonly(toasts)` verhindert dass Consumer das Array direkt manipulieren (z.B. `toast.toasts.value.push(...)` oder `toast.toasts.value = []`). Änderungen am State gehen nur über die Methoden `success()`, `error()`, `warning()`, `info()` und `dismiss()`.

---

### 2. ToastContainer.vue — Rendering

#### Warum 4 ToastProvider?

```html
<ToastProvider v-for="pos in positions" :key="pos" ...>
```

Reka UI rendert alle `ToastRoot`-Kinder eines Providers in dessen einen `ToastViewport`. Hätten wir nur einen Provider, landen alle Toasts in derselben Ecke. Darum: 4 Provider, jeder mit eigenem Viewport in seiner Ecke.

Performance ist kein Problem — jeder Provider ist nur ein paar reactive Watcher + ein Context-Objekt. Kein DOM-Output, kein Timer wenn kein Toast aktiv ist. Bei 4 Stück ist der Overhead null.

#### Der Render-Baum pro Position

```
ToastProvider (verwaltet Timer, Swipe, A11y)
  ├── ToastRoot (der eigentliche Toast, nur wenn einer existiert)
  │     ├── ToastTitle (optional)
  │     ├── ToastDescription (Message, v-html für HTML-Support)
  │     ├── ToastAction (optionaler Action-Button)
  │     └── ToastClose (X-Button, immer da)
  └── ToastPortal (teleportiert in <body>)
        └── ToastViewport (fixed positioniert in der jeweiligen Ecke)
```

#### Kontrollierter State

```html
<ToastRoot :open="true" @update:open="(val) => handleToastOpenChange(val, pos)">
```

```ts
// Reka UI emits update:open for both open and close. We only care about close
function handleToastOpenChange(open: boolean, pos: ToastPosition) {
  if (!open) {
    dismiss(pos)
  }
}
```

Wir setzen `:open="true"` und kontrollieren den State selbst über unser Array. Wenn Reka UI schließen will (Timer abgelaufen, Swipe, Escape-Taste, Close-Button), feuert es `update:open` mit `false`. `handleToastOpenChange` prüft ob es ein Close ist und ruft dann `dismiss()` auf → Toast wird aus dem Array entfernt → `v-if` rendert nichts mehr.

#### Warum `!` (Non-Null Assertions) im Template?

```html
<ToastRoot v-if="getByPosition(pos)" :duration="getByPosition(pos)!.duration" ...>
```

`getByPosition()` gibt `ToastData | undefined` zurück. Innerhalb des `v-if` Blocks wissen wir dass der Wert existiert, aber Vue Templates machen kein TypeScript Type-Narrowing über `v-if`. Daher `!` — "vertrau mir, ist nicht undefined." Die Alternative wäre ein Ein-Element-Array-Hack oder ein Sub-Component mit dem Toast als Prop — beides weniger lesbar für wenig Gewinn.

#### Layering über Modals/Drawers

Drei Dinge sind nötig damit Toasts über Drawern/Modals funktionieren:

**1. z-index:**
```html
<ToastViewport class="fixed z-110 ..." />
```
`z-110` liegt über dem höchsten z-index im Webshop (108 für Modal-Footer).

**2. pointer-events:**
```html
<ToastViewport class="... pointer-events-none" />
<ToastRoot class="... pointer-events-auto" />
```
Der Viewport ist ein unsichtbarer `fixed` Container. Ohne `pointer-events-none` würde er Clicks auf darunterliegende Elemente blockieren. `pointer-events-auto` auf dem Toast selbst hebt das wieder auf — nur der Toast fängt Clicks.

**3. Event-Propagation stoppen:**
```html
<ToastRoot @pointerdown.stop @pointerup.stop @click.stop ...>
```
Ohne das: Klick auf Toast-Close → Toast verschwindet → das Event trifft den Drawer-Overlay darunter → Drawer schließt sich auch. `.stop` verhindert dass Events zum Drawer durchsickern.

---

### 3. Was macht Reka UI vs. was machen wir?

| Feature | Reka UI | Wir |
|---------|---------|-----|
| Timer (auto-close nach X ms) | ja | - |
| Swipe-to-dismiss | ja | - |
| Escape schließt Toast | ja | - |
| F8 fokussiert Toast-Bereich | ja | - |
| Screen Reader (ARIA Live Regions) | ja | - |
| Timer pausiert bei Hover/Focus | ja | - |
| Globaler State | - | ja |
| Replace-Logik (1 Toast pro Ecke) | - | ja |
| 4-Ecken-Positioning | - | ja (4 Provider) |
| Styling | - | ja (Tailwind) |
| onDismiss Callback | - | ja |
| Layering über Modals | - | ja (z-index + pointer-events) |

---

## Vergleich: Alt (Ionic + CommandBus) vs. Neu (Reka UI + Composable)

### Alt
```ts
CommandBus.send<Toast.Error>('toast/error', { message: 'Fehler', autoClose: false })
```
- Indirektion über CommandBus (String-based Events)
- Ionic toastController intern
- Kein Typ-Safety auf dem Event-Namen
- Toast-Implementation versteckt in `messaging/implementations/toast.ts`

### Neu
```ts
const toast = useToast()
toast.error('Fehler', { duration: 0 })
```
- Direkter Funktionsaufruf, volle TypeScript-Unterstützung
- Kein CommandBus, kein Ionic
- Funktioniert überall — Components, Services, plain .ts Files
- `readonly()` verhindert direkte State-Manipulation
- Implementation ist 2 Dateien, ~150 Zeilen total
