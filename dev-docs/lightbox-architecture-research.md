# @page-speed/lightbox Architecture & Implementation Research

**Date:** December 29, 2025
**Status:** Deep research & comprehensive implementation plan
**Priority:** Performance-first, ecosystem-aligned design

---

## Executive Summary

Your custom lightbox (@page-speed/lightbox) should be **built from scratch** rather than forked, leveraging yet-another-react-lightbox as an architectural reference only. Here's why:

### Fork vs Build Analysis

| Aspect | Fork yet-another-react-lightbox | Build from Scratch |
|--------|--------------------------------|-------------------|
| **Bundle Size** | ~27 KB baseline → likely 50+ KB with customizations | Controlled; can be <20 KB |
| **UI/UX Control** | Limited; requires heavy forking of CSS/components | 100% control; matches design system |
| **Design System Integration** | Difficult; coupled to their design patterns | Native integration with @opensite-ui |
| **Performance** | Good baseline but overhead from unused features | Optimized for your specific needs |
| **Maintenance** | Requires tracking upstream changes | Fully owned; no upstream deps |
| **Ecosystem Alignment** | Requires adapters/wrappers | Perfect alignment with tree-shaking |
| **Learning Curve** | Fast if forking; harder if customizing | Medium; clean architecture |
| **Feature Velocity** | Slower; waiting for PR reviews | Fast; direct control |

**Recommendation:** Build from scratch. The design mocks show a dramatically different UI than yet-another-react-lightbox; retrofitting would be harder than clean implementation.

---

## Design System Analysis (from UI Mocks)

Your lightbox design shows these key differentiators vs yet-another-react-lightbox:

### Layout Variants (from file analysis)

1. **yet-another-react-lightbox.jpg** — Baseline comparison (minimal, centered)
2. **lightbox-ui-horizontal-showcase-copy.jpg** — Wide gallery layout with thumbnails below
3. **lightbox-ui-vertical-split-layout-copy.jpg** — Split-screen: content left, controls right (premium design)
4. **lightbox-ui-custom-slides-1-copy.jpg** — Branded slides with custom overlay text
5. **lightbox-ui-custom-slides-2-copy.jpg** — Multi-slide carousels with description overlays
6. **lightbox-ui-vertical-video-showcase-copy.jpg** — Video-optimized layout (tall viewport)
7. **lightbox-ui-horizontal-video-showcase-copy.jpg** — Video-optimized layout (wide viewport)
8. **lightbox-ui-pdf-copy.jpg** — PDF viewer integration (full-page document)

### Key Visual Differences from yet-another-react-lightbox

✅ **Your Design:**
- Dark overlay with subtle pattern (based on @opensite-ui background patterns)
- Polished chrome/toolbar with rounded button groups
- Thumbnail carousel at bottom (scrollable, not grid)
- Integrated PDF viewer (not just images/videos)
- Custom slide layouts with text overlays
- Desktop + mobile responsiveness
- Share/Download/Fullscreen in unified toolbar
- Clean vertical split for complex layouts

❌ **yet-another-react-lightbox:**
- Minimal, utilitarian design
- Basic next/prev arrows
- Limited customization
- No integrated PDF support
- No custom slide layouts

---

## Architecture Decision: Build from Scratch

### Core Philosophy

Your lightbox will follow OpenSite's ecosystem patterns:

```
@page-speed/lightbox/
├── core/ # Runtime lightbox engine (lazy-loaded)
│ ├── Lightbox.tsx # Main controller component
│ ├── LightboxContent.tsx # Content renderer dispatcher
│ ├── useGalleryState.ts # Gallery navigation state hook
│ └── types.ts # Core TypeScript definitions
│
├── components/ # Lightweight UI components (tree-shakable)
│ ├── LightboxOverlay.tsx # Dark overlay + backdrop
│ ├── LightboxChrome.tsx # Toolbar/controls wrapper
│ ├── Controls/ # Individual control buttons
│ │ ├── NavButton.tsx # Prev/Next navigation
│ │ ├── DownloadButton.tsx # Download handler
│ │ ├── ShareButton.tsx # Share modal launcher
│ │ ├── FullscreenButton.tsx # Fullscreen toggle
│ │ └── CloseButton.tsx # Close handler
│ ├── Thumbnails/ # Gallery thumbnail carousel
│ │ ├── ThumbnailCarousel.tsx
│ │ └── ThumbnailItem.tsx
│ └── Layouts/ # Layout variant wrappers
│ ├── HorizontalLayout.tsx # Below/side thumbnails
│ ├── VerticalSplitLayout.tsx # Content | Controls
│ ├── CustomSlideLayout.tsx # Branded slide overlays
│ └── FullScreenLayout.tsx # Full-page takeover
│
├── renderers/ # Content type handlers
│ ├── ImageRenderer.tsx # Images (via @opensite/img)
│ ├── VideoRenderer.tsx # Videos (via @opensite/video)
│ ├── PDFRenderer.tsx # PDFs (via @page-speed/pdf-viewer)
│ └── ComponentRenderer.tsx # Custom React components
│
├── hooks/ # Reusable state/logic hooks
│ ├── useLightbox.ts # Main API hook
│ ├── useGalleryNavigation.ts # Prev/next/jump logic
│ ├── useKeyboardShortcuts.ts # Keyboard handling (arrows, esc, etc)
│ ├── useResponsiveness.ts # Mobile/tablet/desktop detection
│ └── useMediaLoader.ts # Lazy-load media items
│
├── providers/ # Context providers (optional)
│ └── LightboxProvider.tsx # Global lightbox state
│
├── utils/ # Utility functions
│ ├── mediaHelpers.ts # Type detection, URL parsing
│ ├── layoutDetector.ts # Auto-detect layout from props
│ ├── deepLinking.ts # URL hash tracking
│ └── analytics.ts # Event tracking
│
├── styles/ # CSS Modules (not CSS-in-JS)
│ ├── Lightbox.module.css
│ ├── Controls.module.css
│ ├── Thumbnails.module.css
│ └── Layouts.module.css
│
├── api/ # External integrations
│ ├── shareHandlers.ts # Social share URLs
│ └── downloadHandlers.ts # Download logic
│
└── index.ts # Tree-shakable exports

package.json exports:
{
 "exports": {
 ".": "./dist/index.js",
 "./core": "./dist/core/index.js",
 "./hooks": "./dist/hooks/index.js",
 "./renderers": "./dist/renderers/index.js",
 "./components": "./dist/components/index.js"
 }
}
```

---

## Performance Budget

Following ECOSYSTEM_GUIDELINES, the lightbox must adhere to strict bundle limits:

### Bundle Size Targets

```
Core lightbox (Lightbox.tsx + hooks): 12-15 KB gzipped
├── Overlay + Chrome: 2 KB
├── Navigation logic: 3 KB
├── Keyboard handling: 1 KB
└── State management: 2-3 KB

Controls (Download/Share/Fullscreen): 3-4 KB
Thumbnails (carousel): 4-5 KB
Layouts (all variants): 5-6 KB
Renderers (image/video/PDF/component): 6-8 KB

Total baseline: 25-30 KB gzipped
Max recommended: 35 KB gzipped

(Renderers for PDF viewer loaded separately via dynamic import)
```

### Performance Metrics (Lighthouse)

- **LCP**: No impact (<100ms additional)
- **INP**: <200ms (tap to lightbox open, next/prev navigation)
- **CLS**: <0.01 (fixed positioning, no layout thrashing)

---

## Feature Specifications

### 1. Multiple Layout Variants

```typescript
type LightboxLayoutType =
 | 'horizontal' // Thumbnails below content
 | 'vertical-split' // Content | Controls split-screen
 | 'custom-slide' // Branded slide overlays
 | 'fullscreen' // Full-page modal takeover
 | 'inline' // Inline gallery (no modal)

interface LightboxProps {
 layout?: LightboxLayoutType;
 items: LightboxItem[];
 initialIndex?: number;
 height?: string | number;
 maxWidth?: string | number;
 // ... additional props
}
```

### 2. Content Type Support

```typescript
type LightboxItemType = 'image' | 'video' | 'pdf' | 'component';

interface LightboxItem {
 id: string;
 type: LightboxItemType;
 src?: string;
 mediaId?: string; // For @opensite/img/@opensite/video
 component?: React.ComponentType<any>; // Custom React component
 alt?: string;
 caption?: string;
 title?: string;
 srcSet?: string; // For responsive images
 download?: {
 url?: string;
 filename?: string;
 enabled?: boolean;
 };
 share?: {
 enabled?: boolean;
 url?: string;
 title?: string;
 };
}
```

### 3. Control Features

```typescript
interface LightboxControls {
 // Navigation
 navigation?: boolean; // Prev/Next buttons
 keyboard?: boolean; // Arrow keys, Esc
 mouseWheel?: boolean; // Scroll to navigate

 // Media controls
 download?: boolean; // Download button
 fullscreen?: boolean; // Fullscreen toggle
 share?: boolean; // Share button (social links)

 // Display
 thumbnails?: boolean; // Thumbnail carousel
 captions?: boolean; // Show alt/caption text
 counter?: boolean; // Show "1 of 5"
 zoom?: boolean; // Zoom in/out
}
```

### 4. Responsive Behavior

```typescript
// Auto-detect layout based on viewport
const responsiveLayout = {
 desktop: 'horizontal', // >= 1024px
 tablet: 'vertical-split', // 768px - 1023px
 mobile: 'fullscreen', // < 768px
}

// Thumbnails hidden on mobile by default
// Controls always accessible (toolbar on bottom)
// Gestures: swipe to navigate, pinch to zoom
```

---

## Integration with @opensite-ui

Your lightbox will leverage components from [@opensite-ui](https://github.com/opensite-ai/opensite-ui):

### Components to Use

```typescript
// From components/core
import { Button } from '@opensite-ui/components/core/Button';
import { IconButton } from '@opensite-ui/components/core/IconButton';
import { Modal } from '@opensite-ui/components/core/Modal';

// From components/blocks (for custom layouts)
import { GalleryBlock } from '@opensite-ui/components/blocks/gallery';

// For backgrounds
import { BackgroundPattern } from '@opensite-ui/components/blocks/background';

// Design tokens
import { useTheme } from '@opensite-ui/hooks/useTheme';
import { colors, spacing, radius } from '@opensite-ui/design-tokens';
```

---

## Calling Patterns (from Gallery Blocks)

### Basic Usage

```typescript
// In @opensite-ui components/blocks/gallery/GalleryBlock.tsx
import { useLightbox } from '@page-speed/lightbox/hooks';

export function GalleryBlock({ items, layout = 'horizontal' }) {
 const { openLightbox } = useLightbox();

 return (
 <div className="gallery-grid">
 {items.map((item, idx) => (
 <img
 key={item.id}
 src={item.thumbnail}
 onClick={() => openLightbox(items, idx)}
 alt={item.alt}
 />
 ))}
 </div>
 );
}
```

### With PDF Support

```typescript
// In document gallery (menus, catalogs, etc)
import { Lightbox } from '@page-speed/lightbox/core';

export function MenuGallery({ menus }) {
 return (
 <Lightbox
 items={[
 {
 id: 'menu-1',
 type: 'pdf',
 src: 'https://cdn.ing/documents/menu.pdf',
 alt: 'Spring Menu',
 download: { enabled: true },
 },
 ]}
 layout="fullscreen"
 controls={{
 navigation: true,
 download: true,
 fullscreen: true,
 thumbnails: true,
 }}
 />
 );
}
```

---

## Key Implementation Details

### 1. Lazy Loading Content

```typescript
// Load high-res images only when visible
// Load videos only on click/hover
// Load PDFs page-by-page with @page-speed/pdf-viewer

const useMediaLoader = (item: LightboxItem) => {
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 if (item.type === 'image') {
 // Preload via @opensite/img
 const img = new Image();
 img.src = item.src!;
 img.onload = () => setLoaded(true);
 } else if (item.type === 'pdf') {
 // Lazy-load PDF.js when item is visible
 import('@page-speed/pdf-viewer').then(() => setLoaded(true));
 }
 }, [item]);

 return loaded;
};
```

### 2. Keyboard Navigation

```typescript
useKeyboardShortcuts(() => ({
 ArrowLeft: () => galleyState.prev(),
 ArrowRight: () => galleryState.next(),
 Escape: () => lightboxState.close(),
 ' ': (e) => { e.preventDefault(); galleryState.next(); },
}));
```

### 3. Deep Linking

```typescript
// Support URLs like: /gallery?lightbox=item-id
const useDeepLinking = (items: LightboxItem[]) => {
 const router = useRouter();

 const openItem = (item: LightboxItem) => {
 router.push(`?lightbox=${item.id}`);
 };

 useEffect(() => {
 const params = new URLSearchParams(window.location.search);
 const itemId = params.get('lightbox');
 if (itemId) {
 const idx = items.findIndex(i => i.id === itemId);
 if (idx >= 0) lightboxState.open(idx);
 }
 }, []);
};
```

---

## Ecosystem Guidelines Compliance

### ✅ Tree-Shaking

```json
{
 "sideEffects": false,
 "exports": {
 ".": "./dist/index.js",
 "./core": "./dist/core/index.js",
 "./hooks": "./dist/hooks/index.js",
 "./renderers": "./dist/renderers/index.js",
 "./components": "./dist/components/index.js"
 }
}
```

### ✅ Performance-First

- No browser storage APIs
- No external dependencies except React
- CSS Modules only (no CSS-in-JS runtime)
- Dynamic imports for heavy renderers (PDF)

### ✅ TypeScript Strict Mode

All files with `strict: true` configuration

### ✅ SSR Compatible

All browser APIs inside `useEffect` only

---

## Development & Testing

### Unit Testing with Jest

```bash
npm test # Jest + React Testing Library
```

### Integration Testing

Test with actual blocks from @opensite-ui

### Performance Testing

```bash
npm run bundle-analyze # BundlePhobia integration
npm run lighthouse # Core Web Vitals check
npm run perf-bench # Runtime performance
```

---

## Conclusion

Building from scratch allows you to:
1. ✅ Achieve the polished design shown in mocks
2. ✅ Maintain strict performance budget (<25 KB)
3. ✅ Integrate seamlessly with @opensite-ui ecosystem
4. ✅ Support PDF viewing natively
5. ✅ Control all customization without fighting upstream
6. ✅ Own maintenance & feature velocity

**Estimated implementation time: 3-4 weeks** (development + testing + integration)