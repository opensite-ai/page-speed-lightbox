![Page Speed React Lightbox](https://octane.cdn.ing/api/v1/images/transform?url=https://cdn.ing/assets/i/r/286338/xmo09liynb5kdq8o8e0yk3j1kjgf/github.png&q=90)

# @page-speed/lightbox

High‑performance, media‑rich lightbox for React, designed for the DashTrack / OpenSite ecosystem and the Semantic Site Builder engine.

## Overview

`@page-speed/lightbox` renders images, videos, PDFs, and custom React components inside a responsive, keyboard‑friendly lightbox. It is built to be:

- **Fast** – small, tree‑shakable bundles with lazy loading for heavy dependencies (like the PDF viewer).
- **Composable** – separate layers for core hooks, components, and renderers.
- **Semantic‑engine ready** – easy to integrate into the Semantic Site Builder / Chai payload flow.

You can use it both inside the DashTrack platform and in standalone React apps.

## Key Features

- **Multiple media types**: `image`, `video`, `pdf`, and `component` (custom React content).
- **Responsive layouts**: chooses `fullscreen`, `vertical-split`, or `horizontal` layout based on viewport (overridable via props).
- **Keyboard & accessibility**: arrow‑key navigation, Escape to close, and ARIA‑friendly dialog structure.
- **Tree‑shakable exports**: granular subpaths for `core`, `hooks`, `components`, and `renderers`.
- **PDF support**: built‑in PDF rendering via `@page-speed/pdf-viewer`, lazily loaded only when needed.

## Installation

The library has **React 18+** as a peer dependency and ships TypeScript typings out of the box.

### With pnpm (DashTrack default)

```bash
pnpm add @page-speed/lightbox
```

### With npm

```bash
npm install @page-speed/lightbox
```

### With yarn

```bash
yarn add @page-speed/lightbox
```

## Basic Usage (Controlled by Parent)

The `Lightbox` component is intentionally **controlled by mount/unmount**. You decide when it is shown by conditionally rendering it in your component.

```tsx
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@page-speed/lightbox";

const items: LightboxItem[] = [
  { id: "1", type: "image", src: "/images/hero.jpg", alt: "Hero" },
  { id: "2", type: "video", src: "/videos/demo.mp4", title: "Demo" },
];

export function Gallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  return (
    <>
      <button
        onClick={() => {
          setInitialIndex(0);
          setIsOpen(true);
        }}
      >
        Open gallery
      </button>

      {isOpen && (
        <Lightbox
          items={items}
          initialIndex={initialIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

**How it works:**

- Clicking the button sets `isOpen` to `true`, which mounts the `<Lightbox />`.
- When the lightbox is mounted, it locks body scroll and calls `onOpen` (if provided).
- When you close the lightbox (via close button, overlay, or Escape), it calls `onClose`, and the parent should unmount it by toggling `isOpen`.

## Defining Lightbox Items

Items are strongly typed via `LightboxItem` and support different media strategies:

```ts
import type { LightboxItem } from "@page-speed/lightbox";

const items: LightboxItem[] = [
  { id: "img-1", type: "image", src: "/images/hero.jpg", alt: "Hero" },
  { id: "pdf-1", type: "pdf", src: "/docs/brochure.pdf", title: "Brochure" },
  {
    id: "component-1",
    type: "component",
    component: MyCustomSlide,
    data: { heading: "Custom slide" },
  },
];
```

Key fields:

- `id: string` – unique per item.
- `type: "image" | "video" | "pdf" | "component"` – controls which renderer is used.
- `src?: string` – URL for image/video/PDF.
- `alt?: string` – alt text for images.
- `title?` / `caption?` – shown in the chrome/caption area when enabled.
- `component?: React.ComponentType<any>` – for `type: "component"`, your own React slide.
- `download?` / `share?` – optional download/share configuration.

## Lightbox Props (High‑Level)

The full `LightboxProps` type lives in `src/types.ts` and is exported from the package. The most commonly used props are:

- `items: LightboxItem[]` – **required** list of slides.
- `initialIndex?: number` – index of the item to show first.
- `layout?: "horizontal" | "vertical-split" | "custom-slide" | "fullscreen" | "inline"` – override automatic layout.
- `controls?: Partial<LightboxControls>` – enable/disable UI features.
- `height?: string | number` – e.g. `"80vh"`.
- `maxWidth?: string | number` – e.g. `"1200px"`.
- `className?`, `style?` – for wrapping container.
- `onOpen?`, `onClose?` – lifecycle callbacks.
- `onSelect?(index: number)` – called when the current index changes.
- `onNext?`, `onPrev?` – called on navigation.
- `enableKeyboardShortcuts?: boolean` – default `true`.
- `disableScroll?: boolean` – default `true` (locks body scroll while open).
- `closeOnBackdropClick?: boolean` – default `true`.

Example configuring layout and controls:

```tsx
<Lightbox
  items={items}
  layout="horizontal"
  controls={{ navigation: true, keyboard: true, captions: true }}
  onSelect={(index) => console.log("Selected index", index)}
/>
```

## Hooks and Core API

For more advanced usage (especially inside the Semantic Site Builder), you can work directly with the hooks and core exports.

### `useLightbox` (core)

`useLightbox` composes gallery navigation and open/close state into a single hook. It is exported from both `@page-speed/lightbox` and `@page-speed/lightbox/core`.

```ts
import { useLightbox } from "@page-speed/lightbox/core";

const lb = useLightbox({ items, onSelect: (i) => console.log(i) });

// lb: { isOpen, open, close, currentIndex, currentItem, next, prev, canNext, canPrev, goTo, items }
```

You can build your own UI around this hook if you need something different from the default `<Lightbox />` shell.

### Hooks Subpath

The `hooks` subpath provides granular imports for tree‑shaking:

```ts
import { useGalleryState, useResponsiveness } from "@page-speed/lightbox/hooks";
```

Available hooks:

- `useGalleryState` – navigation state for a list of `LightboxItem`s.
- `useLightboxState` – open/close + scroll locking.
- `useLightbox` – composed lightbox controller.
- `useKeyboardShortcuts` – attach keyboard handlers.
- `useResponsiveness` – responsive breakpoint info.

## Components and Renderers

You can import the building blocks individually when constructing custom UIs or integrating into block registries.

### Components

```ts
import {
  Lightbox,
  LightboxOverlay,
  LightboxContent,
  LightboxChrome,
  HorizontalLayout,
} from "@page-speed/lightbox/components";
```

### Renderers

```ts
import {
  ImageRenderer,
  VideoRenderer,
  PDFRenderer,
  ComponentRenderer,
} from "@page-speed/lightbox/renderers";
```

These renderers are what `LightboxContent` uses under the hood for each `LightboxItem.type`.

## Integration Notes for Semantic Site Builder

- Treat `items: LightboxItem[]` as the **projection of your Chai/semantic payload** for a gallery block.
- Use the **controlled mounting pattern**: the builder decides when to show a lightbox by mounting `<Lightbox />` with the appropriate `items` and `initialIndex`.
- For full control or custom block shells, prefer `useLightbox` from `@page-speed/lightbox/core` and wire it into your block registry.

See `dev-docs/lightbox-implementation-guide.md` and `dev-docs/SEMANTIC_SITE_BUILDER.md` in this repo for deeper, platform‑specific details.

## Performance Notes

- Heavy dependencies like the PDF viewer are **lazy‑loaded**, so including support for PDFs does not impact the initial bundle significantly.
- The module exports are **tree‑shakable**, especially when using the subpaths (`/core`, `/hooks`, `/components`, `/renderers`).
- The lightbox locks body scroll while open to reduce layout shift and improve perceived stability.

For broader ecosystem performance guidelines, see `dev-docs/ECOSYSTEM_GUIDELINES.md`.

## Contributing

Contributions are welcome. Please open issues or pull requests on the GitHub repo:

- Repository: <https://github.com/opensite-ai/page-speed-lightbox>

Follow the existing code style, add tests for new behavior, and ensure `pnpm test`, `pnpm run type-check`, and `pnpm run build` all pass before submitting.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Related Projects

- [@page-speed/pdf-viewer](https://github.com/opensite-ai/page-speed-pdf-viewer) – PDF viewer used internally by the lightbox.
- [Page Speed Hooks](https://github.com/opensite-ai/page-speed-hooks) – hooks for optimizing page load behavior.
- [OpenSite AI](https://opensite.ai) – more about the platform and ecosystem.
