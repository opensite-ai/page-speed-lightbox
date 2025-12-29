# @page-speed/lightbox - Complete Implementation Guide

**Build from Scratch (NOT a fork of yet-another-react-lightbox)**

---

## Phase 1: Project Setup (Days 1-2)

### 1.1 Initialize Package Structure

```bash
# Create monorepo package
mkdir @page-speed/lightbox
cd @page-speed/lightbox

# Initialize with TypeScript + React
npm init -y

# Install core dependencies
npm install react react-dom
npm install --save-dev \
 typescript \
 @types/react \
 @types/react-dom \
 @testing-library/react \
 @testing-library/jest-dom \
 jest \
 ts-jest \
 esbuild
```

### 1.2 Package Configuration

```json
{
 "name": "@page-speed/lightbox",
 "version": "1.0.0-alpha.1",
 "description": "High-performance, feature-rich lightbox for OpenSite platform",
 "main": "dist/index.js",
 "module": "dist/index.esm.js",
 "types": "dist/index.d.ts",
 "files": ["dist"],
 "sideEffects": false,
 "exports": {
 ".": {
 "import": "./dist/index.js",
 "require": "./dist/index.cjs",
 "types": "./dist/index.d.ts"
 },
 "./core": {
 "import": "./dist/core/index.js",
 "types": "./dist/core/index.d.ts"
 },
 "./hooks": {
 "import": "./dist/hooks/index.js",
 "types": "./dist/hooks/index.d.ts"
 },
 "./renderers": {
 "import": "./dist/renderers/index.js",
 "types": "./dist/renderers/index.d.ts"
 },
 "./components": {
 "import": "./dist/components/index.js",
 "types": "./dist/components/index.d.ts"
 }
 },
 "scripts": {
 "build": "npm run build:esm && npm run build:cjs",
 "build:esm": "esbuild src/index.ts --bundle --platform=browser --format=esm --outfile=dist/index.js",
 "build:cjs": "esbuild src/index.ts --bundle --platform=browser --format=cjs --outfile=dist/index.cjs",
 "bundle-analyze": "esbuild src/index.ts --bundle --analyze --outfile=/dev/null",
 "test": "jest",
 "test:watch": "jest --watch",
 "test:coverage": "jest --coverage",
 "lint": "tsc --noEmit",
 "type-check": "tsc --noEmit",
 "prepare": "npm run build"
 },
 "peerDependencies": {
 "react": "^18.0.0",
 "react-dom": "^18.0.0"
 }
}
```

---

## Phase 2: Core Types (Days 2-3)

### Complete Type System

```typescript
// src/types.ts

export type LightboxLayoutType =
 | 'horizontal'
 | 'vertical-split'
 | 'custom-slide'
 | 'fullscreen'
 | 'inline';

export type LightboxItemType = 'image' | 'video' | 'pdf' | 'component';

export interface LightboxDownload {
 enabled?: boolean;
 url?: string;
 filename?: string;
}

export interface LightboxShare {
 enabled?: boolean;
 platforms?: Array<'facebook' | 'twitter' | 'pinterest' | 'linkedin' | 'email' | 'copy'>;
 url?: string;
 title?: string;
}

export interface LightboxItem {
 id: string;
 type: LightboxItemType;
 src?: string;
 mediaId?: string;
 srcSet?: string;
 alt?: string;
 caption?: string;
 title?: string;
 thumbnail?: string;
 download?: LightboxDownload | boolean;
 share?: LightboxShare | boolean;
 data?: Record<string, any>;
 component?: React.ComponentType<any>;
}

export interface LightboxControls {
 navigation?: boolean;
 keyboard?: boolean;
 mouseWheel?: boolean;
 swipe?: boolean;
 thumbnails?: boolean;
 counter?: boolean;
 captions?: boolean;
 zoom?: boolean;
 download?: boolean;
 share?: boolean;
 fullscreen?: boolean;
 closeButton?: boolean;
}

export interface LightboxProps {
 items: LightboxItem[];
 initialIndex?: number;
 layout?: LightboxLayoutType;
 height?: string | number;
 maxWidth?: string | number;
 className?: string;
 style?: React.CSSProperties;
 controls?: Partial<LightboxControls>;
 onOpen?: () => void;
 onClose?: () => void;
 onSelect?: (index: number, item: LightboxItem) => void;
 onNext?: () => void;
 onPrev?: () => void;
 enableDeepLinking?: boolean;
 enableKeyboardShortcuts?: boolean;
 disableScroll?: boolean;
 closeOnBackdropClick?: boolean;
 closeOnEscape?: boolean;
}
```

---

## Phase 3: State Management Hooks (Days 3-5)

### useGalleryState Hook

```typescript
// src/hooks/useGalleryState.ts
import { useState, useCallback } from 'react';
import { LightboxItem } from '../types';

export function useGalleryState({
 items,
 initialIndex = 0,
 onSelect,
}: {
 items: LightboxItem[];
 initialIndex?: number;
 onSelect?: (index: number) => void;
}) {
 const [currentIndex, setCurrentIndex] = useState(
 Math.max(0, Math.min(initialIndex, items.length - 1))
 );

 const currentItem = items[currentIndex] ?? null;

 const goToIndex = useCallback((index: number) => {
 if (index < 0 || index >= items.length) return;
 setCurrentIndex(index);
 onSelect?.(index);
 }, [items.length, onSelect]);

 const next = useCallback(() => {
 goToIndex(currentIndex + 1);
 }, [currentIndex, goToIndex]);

 const prev = useCallback(() => {
 goToIndex(currentIndex - 1);
 }, [currentIndex, goToIndex]);

 return {
 currentIndex,
 currentItem,
 goToIndex,
 next,
 prev,
 canNext: currentIndex < items.length - 1,
 canPrev: currentIndex > 0,
 };
}
```

### useLightboxState Hook

```typescript
// src/hooks/useLightboxState.ts
import { useState, useCallback, useEffect } from 'react';

export function useLightboxState({
 onOpen,
 onClose,
 disableScroll = true,
}: {
 onOpen?: () => void;
 onClose?: () => void;
 disableScroll?: boolean;
}) {
 const [isOpen, setIsOpen] = useState(false);

 const open = useCallback(() => {
 setIsOpen(true);
 onOpen?.();
 if (disableScroll) {
 document.body.style.overflow = 'hidden';
 }
 }, [onOpen, disableScroll]);

 const close = useCallback(() => {
 setIsOpen(false);
 onClose?.();
 if (disableScroll) {
 document.body.style.overflow = '';
 }
 }, [onClose, disableScroll]);

 useEffect(() => {
 return () => {
 if (disableScroll) {
 document.body.style.overflow = '';
 }
 };
 }, [disableScroll]);

 return { isOpen, open, close };
}
```

### useKeyboardShortcuts Hook

```typescript
// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

export function useKeyboardShortcuts(
 shortcuts: Record<string, (e?: KeyboardEvent) => void>,
 enabled: boolean = true
) {
 useEffect(() => {
 if (!enabled) return;

 const handleKeyDown = (e: KeyboardEvent) => {
 const handler = shortcuts[e.key];
 if (handler) {
 handler(e);
 }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [shortcuts, enabled]);
}
```

### useResponsiveness Hook

```typescript
// src/hooks/useResponsiveness.ts
import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsiveness() {
 const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

 useEffect(() => {
 const updateBreakpoint = () => {
 if (window.innerWidth < 768) {
 setBreakpoint('mobile');
 } else if (window.innerWidth < 1024) {
 setBreakpoint('tablet');
 } else {
 setBreakpoint('desktop');
 }
 };

 updateBreakpoint();
 window.addEventListener('resize', updateBreakpoint);
 return () => window.removeEventListener('resize', updateBreakpoint);
 }, []);

 return {
 breakpoint,
 isMobile: breakpoint === 'mobile',
 isTablet: breakpoint === 'tablet',
 isDesktop: breakpoint === 'desktop',
 };
}
```

### useLightbox Main Hook

```typescript
// src/hooks/useLightbox.ts
import { useCallback } from 'react';
import { LightboxItem, LightboxProps } from '../types';
import { useGalleryState } from './useGalleryState';
import { useLightboxState } from './useLightboxState';

export function useLightbox(props?: Partial<LightboxProps>) {
 const {
 items = [],
 initialIndex = 0,
 onSelect,
 onOpen,
 onClose,
 disableScroll = true,
 } = props || {};

 const lightboxState = useLightboxState({ onOpen, onClose, disableScroll });
 const galleryState = useGalleryState({ items, initialIndex, onSelect });

 return {
 items,
 currentIndex: galleryState.currentIndex,
 isOpen: lightboxState.isOpen,
 currentItem: galleryState.currentItem,
 canNext: galleryState.canNext,
 canPrev: galleryState.canPrev,
 open: lightboxState.open,
 close: lightboxState.close,
 next: galleryState.next,
 prev: galleryState.prev,
 goTo: galleryState.goToIndex,
 };
}
```

---

## Phase 4: Main Components (Days 5-7)

### Lightbox Component

```typescript
// src/components/Lightbox.tsx
import React, { useEffect } from 'react';
import { LightboxProps } from '../types';
import { useLightbox } from '../hooks/useLightbox';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useResponsiveness } from '../hooks/useResponsiveness';
import { LightboxOverlay } from './LightboxOverlay';
import { LightboxContent } from './LightboxContent';
import { LightboxChrome } from './LightboxChrome';
import { HorizontalLayout } from './Layouts/HorizontalLayout';
import styles from '../styles/Lightbox.module.css';

export function Lightbox(props: LightboxProps) {
 const lightbox = useLightbox(props);
 const { breakpoint } = useResponsiveness();

 useKeyboardShortcuts(
 {
 ArrowLeft: lightbox.prev,
 ArrowRight: lightbox.next,
 Escape: lightbox.close,
 ' ': (e) => {
 e?.preventDefault();
 lightbox.next();
 },
 },
 lightbox.isOpen && (props.enableKeyboardShortcuts ?? true)
 );

 const activeLayout = props.layout ?? 'horizontal';

 if (!lightbox.isOpen) return null;

 return (
 <div className={styles.lightboxPortal}>
 <LightboxOverlay
 onClose={lightbox.close}
 closeOnBackdropClick={props.closeOnBackdropClick ?? true}
 />

 <div className={`${styles.lightboxContainer} ${styles[activeLayout]}`}>
 <HorizontalLayout
 lightbox={lightbox}
 controls={props.controls || {}}
 height={props.height}
 maxWidth={props.maxWidth}
 >
 <LightboxContent item={lightbox.currentItem} />
 </HorizontalLayout>
 </div>
 </div>
 );
}
```

### LightboxContent Dispatcher

```typescript
// src/components/LightboxContent.tsx
import React, { Suspense, lazy } from 'react';
import { LightboxItem } from '../types';
import { ImageRenderer } from '../renderers/ImageRenderer';
import { VideoRenderer } from '../renderers/VideoRenderer';

const PDFRenderer = lazy(() => import('../renderers/PDFRenderer'));

export function LightboxContent({ item }: { item: LightboxItem | null }) {
 if (!item) return <div>No content</div>;

 switch (item.type) {
 case 'image':
 return <ImageRenderer item={item} />;
 case 'video':
 return <VideoRenderer item={item} />;
 case 'pdf':
 return (
 <Suspense fallback={<div>Loading PDF...</div>}>
 <PDFRenderer item={item} />
 </Suspense>
 );
 default:
 return <div>Unknown content type</div>;
 }
}
```

### LightboxOverlay Component

```typescript
// src/components/LightboxOverlay.tsx
import React from 'react';
import styles from '../styles/Lightbox.module.css';

export function LightboxOverlay({
 onClose,
 closeOnBackdropClick = true,
}: {
 onClose: () => void;
 closeOnBackdropClick?: boolean;
}) {
 return (
 <div
 className={styles.overlay}
 onClick={closeOnBackdropClick ? onClose : undefined}
 aria-hidden="true"
 />
 );
}
```

---

## Phase 5: Renderers (Days 7-9)

### ImageRenderer

```typescript
// src/renderers/ImageRenderer.tsx
import React, { useState } from 'react';
import { LightboxItem } from '../types';
import styles from '../styles/Lightbox.module.css';

export function ImageRenderer({ item }: { item: LightboxItem }) {
 const [isLoaded, setIsLoaded] = useState(false);

 return (
 <div className={styles.imageContainer}>
 <img
 src={item.src}
 srcSet={item.srcSet}
 alt={item.alt}
 title={item.title}
 onLoad={() => setIsLoaded(true)}
 className={styles.image}
 />
 {item.caption && (
 <figcaption className={styles.caption}>{item.caption}</figcaption>
 )}
 </div>
 );
}
```

### VideoRenderer

```typescript
// src/renderers/VideoRenderer.tsx
import React from 'react';
import { LightboxItem } from '../types';
import styles from '../styles/Lightbox.module.css';

export function VideoRenderer({ item }: { item: LightboxItem }) {
 return (
 <div className={styles.videoContainer}>
 <video controls className={styles.video}>
 <source src={item.src} />
 Your browser does not support the video tag.
 </video>
 </div>
 );
}
```

### PDFRenderer (Lazy-Loaded)

```typescript
// src/renderers/PDFRenderer.tsx
import React, { Suspense, lazy } from 'react';
import { LightboxItem } from '../types';
import styles from '../styles/Lightbox.module.css';

const PDFViewer = lazy(() => import('@page-speed/pdf-viewer'));

export function PDFRenderer({ item }: { item: LightboxItem }) {
 return (
 <div className={styles.pdfContainer}>
 <Suspense fallback={<div>Loading PDF...</div>}>
 <PDFViewer
 url={item.src}
 title={item.title}
 showControls={true}
 height="100%"
 />
 </Suspense>
 </div>
 );
}

export default PDFRenderer;
```

---

## Phase 6: CSS Styling (Days 9-10)

### Lightbox.module.css

```css
.lightboxPortal {
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 z-index: 1000;
 display: flex;
 align-items: center;
 justify-content: center;
 overflow: hidden;
}

.overlay {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.85);
 z-index: 1;
}

.lightboxContainer {
 position: relative;
 z-index: 2;
 display: flex;
 flex-direction: column;
 background: white;
 border-radius: 12px;
 box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
 max-height: 90vh;
 max-width: 90vw;
 overflow: hidden;
}

.imageContainer,
.videoContainer,
.pdfContainer {
 display: flex;
 align-items: center;
 justify-content: center;
 overflow: auto;
 background: #000;
 flex: 1;
 min-height: 300px;
}

.image,
.video {
 max-width: 100%;
 max-height: 100%;
 object-fit: contain;
}

.caption {
 padding: 12px 16px;
 background: rgba(0, 0, 0, 0.6);
 color: white;
 font-size: 14px;
 margin: 0;
 text-align: center;
}

@media (max-width: 768px) {
 .lightboxContainer {
 max-height: 100vh;
 max-width: 100vw;
 border-radius: 0;
 }
}
```

---

## Phase 7: Tree-Shakable Exports (Days 10-11)

### Main Export File

```typescript
// src/index.ts
export { Lightbox } from './components/Lightbox';
export { LightboxContent } from './components/LightboxContent';
export { LightboxOverlay } from './components/LightboxOverlay';

export {
 useLightbox,
 useGalleryState,
 useLightboxState,
 useKeyboardShortcuts,
 useResponsiveness,
} from './hooks';

export {
 ImageRenderer,
 VideoRenderer,
 PDFRenderer,
} from './renderers';

export type {
 LightboxProps,
 LightboxItem,
 LightboxLayoutType,
 LightboxControls,
} from './types';
```

---

## Phase 8: Integration with GalleryBlock (Days 11-12)

```typescript
// In @opensite-ui/components/blocks/gallery/GalleryBlock.tsx
import React, { useState } from 'react';
import { useLightbox } from '@page-speed/lightbox/hooks';
import { Lightbox } from '@page-speed/lightbox/core';

export function GalleryBlock({ items, layout = 'horizontal' }) {
 const [selectedIndex, setSelectedIndex] = useState(0);
 const lightbox = useLightbox();

 const lightboxItems = items.map(item => ({
 id: item.id,
 type: item.type,
 src: item.src,
 alt: item.alt,
 caption: item.caption,
 download: true,
 share: true,
 }));

 return (
 <>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
 {items.map((item, idx) => (
 <img
 key={item.id}
 src={item.thumbnail}
 onClick={() => {
 setSelectedIndex(idx);
 lightbox.open();
 }}
 alt={item.alt}
 style={{ cursor: 'pointer', width: '100%' }}
 />
 ))}
 </div>

 {lightbox.isOpen && (
 <Lightbox
 items={lightboxItems}
 initialIndex={selectedIndex}
 layout={layout}
 onClose={lightbox.close}
 enableKeyboardShortcuts={true}
 />
 )}
 </>
 );
}
```

---

## Phase 9: Testing (Days 12-13)

```typescript
// src/__tests__/hooks.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useLightbox } from '../hooks/useLightbox';

describe('useLightbox', () => {
 const mockItems = [
 { id: '1', type: 'image' as const, src: 'img1.jpg', alt: 'Image 1' },
 { id: '2', type: 'image' as const, src: 'img2.jpg', alt: 'Image 2' },
 ];

 it('should open and close lightbox', () => {
 const { result } = renderHook(() => useLightbox({ items: mockItems }));

 expect(result.current.isOpen).toBe(false);

 act(() => {
 result.current.open();
 });

 expect(result.current.isOpen).toBe(true);

 act(() => {
 result.current.close();
 });

 expect(result.current.isOpen).toBe(false);
 });

 it('should navigate between items', () => {
 const { result } = renderHook(() => useLightbox({ items: mockItems }));

 act(() => {
 result.current.open();
 });

 expect(result.current.currentIndex).toBe(0);

 act(() => {
 result.current.next();
 });

 expect(result.current.currentIndex).toBe(1);
 });
});
```

---

## Phase 10: Build & Publish (Days 13-14)

```bash
# Build
npm run build

# Verify bundle size
npm run bundle-analyze

# Test
npm run test

# Lint
npm run lint

# Version
npm version minor

# Publish
npm publish
```

---

## Summary

**Total Implementation: 2-3 weeks**

- ✅ Phase 1: Project setup (2 days)
- ✅ Phase 2: Core types (1 day)
- ✅ Phase 3: State management hooks (2 days)
- ✅ Phase 4: Components (3 days)
- ✅ Phase 5: Renderers (3 days)
- ✅ Phase 6: Styling (2 days)
- ✅ Phase 7: Integration & exports (1 day)
- ✅ Phase 8: Gallery block integration (1 day)
- ✅ Phase 9: Testing (2 days)
- ✅ Phase 10: Build & publish (1 day)