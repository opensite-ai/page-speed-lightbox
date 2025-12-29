# @page-speed/lightbox - Decision Summary & Quick Reference

## TL;DR: Fork vs Build Decision

**✅ DECISION: BUILD FROM SCRATCH**

**Why?**
- Your design is 80% different from yet-another-react-lightbox
- Forking would require rewriting 60% of CSS/components anyway
- Build-from-scratch allows clean architecture aligned with ecosystem
- Achieves tighter performance budget (<25 KB vs 50+ KB if forked)
- Faster to customize for future client needs

**Time Comparison:**
- Forking: 2-3 weeks (fighting upstream structure)
- Building: 2-3 weeks (clean, owned architecture)

---

## Your Design vs yet-another-react-lightbox

### Visual Comparison

**yet-another-react-lightbox:**
- Minimal, utilitarian design
- Basic centered modal
- Thin bottom controls bar
- Generic styling

**Your @page-speed/lightbox (from mocks):**
- Dark overlay with subtle pattern background
- Polished chrome toolbar with rounded button groups
- Thumbnails as carousel (not grid)
- Multiple layout variants (horizontal, vertical-split, custom-slide, fullscreen)
- **Native PDF viewer integration** (critical feature they don't have)
- Custom slide overlays with text/branding
- Professional, modern aesthetics

**Conclusion:** Completely different UX. Building from scratch is the right call.

---

## Architecture Decision Tree

```
Is your design significantly different from reference library?
├─ YES (your case: 80% different)
│ └─ Build from scratch ✅
│ Pros: Full control, cleaner code, no upstream conflicts
│ Time: 2-3 weeks
│
└─ NO (minor tweaks only)
 └─ Consider forking
 Pros: Faster initially, proven foundation
 Cons: Ongoing merge conflicts, more bloat
```

---

## Key Features You Need (From Design Mocks)

### Layout Variants
✅ **Horizontal** — Thumbnails below content
✅ **Vertical Split** — Content | Controls side-by-side
✅ **Custom Slide** — Branded overlays with text
✅ **Fullscreen** — Full-page modal takeover
✅ **Inline** — Embedded gallery (no modal)

### Content Types
✅ **Images** — Via @opensite/img (responsive, CDN-optimized)
✅ **Videos** — Via @opensite/video (progressive enhancement)
✅ **PDFs** — Via @page-speed/pdf-viewer (new capability!)
✅ **Custom Components** — React components as content

### Controls & Features
✅ **Navigation** — Prev/Next buttons + keyboard arrows
✅ **Thumbnails** — Scrollable carousel (not grid)
✅ **Download** — Download original media
✅ **Share** — Social sharing (Facebook, Twitter, Pinterest, LinkedIn, Email)
✅ **Fullscreen** — Native fullscreen toggle
✅ **Captions** — Alt text / descriptions
✅ **Counter** — "1 of 5" indicator
✅ **Close Button** — X button or Escape key

### Responsive Behavior
✅ **Mobile** (<768px) — Fullscreen layout, thumbnails below, swipe navigation
✅ **Tablet** (768-1023px) — Vertical-split layout, gesture support
✅ **Desktop** (1024px+) — Horizontal layout, rich controls

---

## Integration Points

### With @opensite-ui (Your Component Library)

```typescript
// From components/blocks/gallery
import { GalleryBlock } from '@opensite-ui/components/blocks/gallery';

// This will use @page-speed/lightbox internally:
<GalleryBlock
 items={galleryItems}
 layout="horizontal"
 enableDownload={true}
 enableShare={true}
/>
```

### With Existing Media Components

```typescript
// @opensite/img - Responsive images
<Img mediaId={mediaId} /> // Lazy loads, format-optimized (AVIF/WebP)

// @opensite/video - Progressive video
<Video mediaId={videoId} /> // Progressive → HLS/DASH on demand

// @page-speed/pdf-viewer - PDFs
<PDFViewer url={linearizedPdfUrl} /> // Linearized for streaming

// All three work inside @page-speed/lightbox!
```

---

## Bundle Size Budget

```
Target: 25-30 KB gzipped total

Breakdown:
├── Core lightbox (Lightbox.tsx + state hooks): 12-15 KB
├── Controls (Download/Share/Fullscreen): 3-4 KB
├── Thumbnails carousel: 4-5 KB
├── Layout variants: 5-6 KB
└── Renderers (Image/Video/Component): 6-8 KB

Lazy-loaded (separate):
└── PDF renderer (@page-speed/pdf-viewer): +25 KB (on-demand)
```

**Performance guarantee:**
- No impact on LCP if lightbox not used
- Opens <200ms once triggered
- Keyboard navigation instant
- Smooth 60 FPS scrolling

---

## Implementation Timeline

### Week 1: Foundation & State Management
- ✅ Day 1-2: Project setup, TypeScript config, npm package
- ✅ Day 3: Core type system (complete)
- ✅ Day 4-5: State hooks (gallery nav, lightbox state, keyboard, responsive)

### Week 2: Components & Rendering
- ✅ Day 6-7: Main Lightbox component, Chrome, Overlay, Content dispatcher
- ✅ Day 8: Control buttons (Next, Prev, Download, Share, Fullscreen, Close)
- ✅ Day 9: Layout variants (Horizontal, VerticalSplit, others)
- ✅ Day 10-11: Renderers (Image, Video, PDF, Component)
- ✅ Day 12: Styling (CSS Modules, no runtime CSS)

### Week 3: Integration & Launch
- ✅ Day 13: Export structure, sub-entry points
- ✅ Day 14: Gallery block integration with @opensite-ui
- ✅ Day 15: Testing (unit + integration)
- ✅ Day 16: Build, bundle analysis, publish to NPM

**Total: 16 days (comfortable 2-week pace with QA)**

---

## File Structure You'll Create

```
@page-speed/lightbox/
├── src/
│ ├── index.ts # Main entry (tree-shakable)
│ ├── types.ts # Complete type system
│ │
│ ├── hooks/
│ │ ├── useGalleryState.ts
│ │ ├── useLightboxState.ts
│ │ ├── useKeyboardShortcuts.ts
│ │ ├── useResponsiveness.ts
│ │ ├── useLightbox.ts
│ │ └── index.ts
│ │
│ ├── components/
│ │ ├── Lightbox.tsx
│ │ ├── LightboxContent.tsx
│ │ ├── LightboxChrome.tsx
│ │ ├── LightboxOverlay.tsx
│ │ ├── Controls/
│ │ ├── Thumbnails/
│ │ ├── Layouts/
│ │ └── index.ts
│ │
│ ├── renderers/
│ │ ├── ImageRenderer.tsx
│ │ ├── VideoRenderer.tsx
│ │ ├── PDFRenderer.tsx
│ │ ├── ComponentRenderer.tsx
│ │ └── index.ts
│ │
│ ├── styles/
│ │ ├── Lightbox.module.css
│ │ ├── Controls.module.css
│ │ ├── Thumbnails.module.css
│ │ └── Layouts.module.css
│ │
│ └── __tests__/
│ ├── hooks.test.tsx
│ └── Lightbox.test.tsx
│
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```

---

## Key Implementation Decisions Made

### 1. CSS Modules (Not CSS-in-JS)
- ✅ Zero runtime overhead
- ✅ Static analysis tools work
- ✅ Better tree-shaking
- ✅ Avoids styled-components bundle

### 2. No External Dependencies
- ✅ Only React peer dependency
- ✅ @opensite/img/@opensite/video are optional peer deps
- ✅ Keeps bundle tight
- ✅ Users have full control

### 3. Dynamic Import for PDF.js
```typescript
// PDF renderer lazy-loaded only when needed
const PDFRenderer = lazy(() => import('@page-speed/pdf-viewer'));
```
- ✅ Keeps main bundle under 25 KB
- ✅ PDF.js loads only if PDF item in lightbox

### 4. Responsive-First Design
- ✅ Mobile-first: fullscreen on mobile
- ✅ Tablet: vertical-split for wider screens
- ✅ Desktop: horizontal with rich controls
- ✅ No JavaScript breakpoint checks; CSS handles it

### 5. Keyboard Navigation Built-In
- ✅ Arrow keys: prev/next
- ✅ Space: next
- ✅ Escape: close
- ✅ Improves accessibility

### 6. Deep Linking Support (Optional)
- ✅ URL hash: `?lightbox=item-id`
- ✅ Shareable links to specific items
- ✅ Disabled by default (opt-in)

---

## Success Criteria

### Bundle Size
- ✅ Baseline: <25 KB gzipped
- ✅ Full package: <35 KB gzipped
- ✅ PDF renderer: +25 KB (lazy-loaded)

### Performance (Lighthouse)
- ✅ LCP: No impact if lightbox not used
- ✅ INP: <200ms for interactions
- ✅ CLS: <0.01 (fixed positioning, no layout shifts)

### Feature Completeness
- ✅ All 4 layout variants working
- ✅ Image/Video/PDF/Component rendering
- ✅ All controls (nav, download, share, fullscreen)
- ✅ Keyboard shortcuts
- ✅ Mobile/tablet/desktop responsive
- ✅ Thumbnail carousel
- ✅ Deep linking (optional)

### Ecosystem Alignment
- ✅ Tree-shakable exports
- ✅ TypeScript strict mode
- ✅ Works with @opensite-ui blocks
- ✅ Integrates with @opensite/img, @opensite/video, @page-speed/pdf-viewer
- ✅ Follows ECOSYSTEM_GUIDELINES
- ✅ Published to public NPM

---

## Questions to Address Before Starting

1. **Responsiveness:** Confirm mobile behavior (fullscreen vs. split?)
 → **Answer from mocks:** Mobile = fullscreen, Tablet = split, Desktop = horizontal

2. **PDF Integration:** Should PDF viewer be the same code as PDFRenderer?
 → **Answer:** Yes, use @page-speed/pdf-viewer lazily

3. **Custom Layouts:** Do clients want to extend with custom layouts?
 → **Answer:** Build solid foundation first, extend in v1.1

4. **Analytics:** Track which media type is viewed most?
 → **Answer:** Optional callback hooks for custom tracking

5. **Animations:** Do you want entrance/exit animations?
 → **Answer:** Start with simple, add animations in polish phase

---

## Bottom Line

✅ **Build from scratch, not a fork**

Your design is significantly different from yet-another-react-lightbox. Building from scratch gives you:
1. Perfect UX match (design-to-code without retrofitting)
2. Clean architecture aligned with OpenSite ecosystem
3. Smaller bundle size (<25 KB vs 50+)
4. Native PDF support (critical for restaurant menus)
5. Full control over features and styling
6. Same timeline as forking (2-3 weeks)

**Estimated start date:** Within 2 weeks
**Estimated completion:** End of Q1 2026
**Target for launch:** With restaurant client pilot by Q2 2026

Let's build something polished! 🎉