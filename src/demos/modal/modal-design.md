# Responsive Modal System — Design Spec

## Goal

Replace Ionic's `modalController` + `ion-modal` with a Vue-native responsive modal system using **vaul-vue** (Bottom Sheet on mobile) and **Reka UI Dialog** (centered modal on desktop). One API, automatic viewport switching at `xl` (1200px).

## API

### Opening a modal

```ts
import { showModal } from './useModal'

const { data, role } = await showModal({
  component: LoginForm,
  componentProps: { redirect: '/account' },

  // Layout
  size: 'medium',    // 'small' (438px) | 'medium' (672px) | 'large' (1140px)
  autoHeight: true,  // content-driven height instead of fixed max-height
  showHandle: false, // hide drag handle on sheets (default: true)

  // Dismiss control
  backdropDismiss: true,                        // default: true
  canDismiss: (reason) => reason !== 'swipe',   // optional catch-all
  preventEscapeDismiss: false,                  // granular override
  preventSwipeDismiss: true,                    // granular override
  preventBackdropDismiss: false,                // granular override

  // Lifecycle
  onPresent: () => trackView(),       // after enter animation completes
  onWillDismiss: () => saveState(),   // before leave animation starts
  onDidDismiss: () => cleanup(),      // after leave animation completes
})

if (role === 'success') {
  // handle success
}
```

### Inside a modal component

```ts
import { useModal } from './useModal'

const { dismiss, dismissAll } = useModal()

// Dismiss with data and typed role
dismiss({ submitted: true }, 'success')
dismiss(null, 'cancel')

// Close entire modal stack
dismissAll()
```

### Modal content structure

Content components wrap themselves with `ModalTemplate`, providing their own header/footer/body via slots — same pattern as current Ionic modals:

```vue
<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="Login" close-button />
    </template>

    <form>...</form>

    <template #footer>
      <button @click="dismiss(null, 'cancel')">Cancel</button>
      <button @click="submit">Login</button>
    </template>
  </ModalTemplate>
</template>
```

## Types

```ts
type ModalSize = 'small' | 'medium' | 'large'

type DismissReason = 'escape' | 'backdrop' | 'swipe' | 'close-button' | 'programmatic'

interface ModalOptions {
  component: Component
  componentProps?: Record<string, unknown>
  size?: ModalSize                                     // default: 'medium'
  autoHeight?: boolean                                 // default: false
  showHandle?: boolean                                 // default: true
  backdropDismiss?: boolean                            // default: true
  canDismiss?: (reason: DismissReason) => boolean      // optional catch-all
  preventEscapeDismiss?: boolean                       // default: false
  preventSwipeDismiss?: boolean                        // default: false
  preventBackdropDismiss?: boolean                     // default: false
  onPresent?: () => void
  onWillDismiss?: () => void
  onDidDismiss?: () => void
}

interface ModalResult<T = unknown> {
  data: T | null
  role: string
}
```

## Sizes (Desktop Dialog widths)

| Size | Width | Webshop equivalent |
|------|-------|-------------------|
| `small` | 438px | Default modals |
| `medium` | 672px | CMS modals |
| `large` | 1140px | Maps modal |

Mobile sheets are always full-width regardless of `size`.

## Dismiss Flow

1. User action triggers dismiss (Escape / Backdrop click / Swipe / Close button / programmatic `dismiss()`)
2. Determine `DismissReason` from the source event
3. Check granular flags first (`preventEscapeDismiss`, `preventSwipeDismiss`, `preventBackdropDismiss`)
4. If not blocked by flags, call `canDismiss(reason)` if provided
5. If allowed → call `onWillDismiss` → remove from stack → call `onDidDismiss` → resolve Promise with `{ data, role }`

Reason mapping:
- Reka UI `escapeKeyDown` event → `'escape'`
- Reka UI `pointerDownOutside` event (backdrop) → `'backdrop'`
- Close button click → `'close-button'`
- vaul-vue swipe-to-dismiss → `'swipe'`
- `dismiss()` called programmatically → `'programmatic'`

## Modal Stack

```ts
const modalStack = shallowRef<ModalInstance[]>([])
```

- `showModal()` pushes a new `ModalInstance` onto the stack
- `dismiss()` pops the topmost instance, resolves its Promise
- `dismissAll()` iterates the stack in reverse, calls `onWillDismiss` for each, clears the array, resolves all Promises with `{ data: null, role: 'dismiss-all' }`
- Multiple modals render simultaneously (stacked with increasing z-index)

### Backdrop behavior for stacked modals

- First modal: `bg-black/30` backdrop (~32% opacity, matches webshop)
- Stacked modals: transparent backdrop (no additional dimming) + heavy box-shadow `0 28px 48px rgba(0,0,0,0.4)`

## Responsive Behavior

Viewport evaluated **once at open time** via `window.innerWidth >= 1200`:

- `< xl` (< 1200px): Renders **vaul-vue** Bottom Sheet
  - Full-width, swipe-to-dismiss
  - `size` prop ignored (always full-width)
  - Drag handle shown by default (configurable via `showHandle`)
- `>= xl` (>= 1200px): Renders **Reka UI Dialog**
  - Centered modal with backdrop
  - Width determined by `size` prop
  - Focus trapping automatic (Reka UI built-in)

If viewport changes while modal is open: **nothing happens** — stays in the mode it was opened in. Prevents form state loss.

## Built-in Improvements over Ionic

1. **Typed dismiss reasons** — `DismissReason` union type instead of magic strings
2. **Clean `dismissAll()`** — array clear + Promise resolve, no retry loops
3. **Automatic responsive** — no `smallerThanXL.value ? [0, 1] : undefined` boilerplate per modal function
4. **Focus trapping** — Reka UI Dialog handles it natively
5. **Scrollbar click fix** — `@pointer-down-outside` handler prevents accidental dismiss when clicking scrollbar on scrollable content
6. **No Ionic dependency** — pure Vue + Reka UI + vaul-vue

## Known Issues

### `aria-hidden` browser warning

When opening a modal, Chrome 128+ may log:
> "Blocked aria-hidden on an element because its descendant retained focus"

This is a [known open issue in reka-ui (#1280)](https://github.com/unovue/reka-ui/issues/1280). It happens because reka-ui sets `aria-hidden="true"` on the page content when a modal dialog opens, but the previously focused button hasn't blurred yet. The W3C spec recommends using `inert` instead of `aria-hidden`, but reka-ui hasn't migrated yet.

**Impact:** Console warning only. No functional impact, no accessibility impact for users.
**Fix:** Will resolve automatically when reka-ui updates their implementation.

## File Structure

```
src/demos/modal/
  ResponsiveModal.vue      — unified component (Sheet <xl, Dialog >=xl)
  ModalTemplate.vue        — layout wrapper (header/content/footer + scroll shadows)
  ModalHeader.vue          — default header (title, back button, close button)
  useModal.ts              — showModal(), dismiss(), dismissAll(), modal stack
  modal-design.md          — this file
  examples/
    BasicContent.vue       — simple content for size/dismiss testing
    FormContent.vue        — form with validation, returns data on submit
    ScrollContent.vue      — long content for scroll shadow testing
    NestedContent.vue      — opens modals in different sizes, dismissAll
    MultiStepContent.vue   — 3-step wizard with back button
    UndismissableContent.vue — no close button, auto-closes after 3s
    ConfirmContent.vue     — small confirm dialog (autoHeight)
```

## Demo Test Cases

- All 3 sizes (small, medium, large)
- Auto height (content-driven height)
- No drag handle
- Sheet mode (resize browser < 1200px)
- Dialog mode (>= 1200px)
- Form with `canDismiss` preventing swipe/backdrop
- `preventEscapeDismiss` / `preventBackdropDismiss`
- Persistent modal (`backdropDismiss: false`, `preventSwipeDismiss: true`)
- Block everything (`canDismiss: () => false`)
- Undismissable (no close button, programmatic auto-close)
- Nested modals with different sizes + `dismissAll()`
- Dismiss with role (`'success'` / `'cancel'`) and verify return value
- Scrollable content with header/footer scroll shadows
- Multi-step form with back button
- Lifecycle callbacks (`onPresent`, `onWillDismiss`, `onDidDismiss`)
- Toast over modal (z-index layering)
