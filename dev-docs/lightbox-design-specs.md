# @page-speed/lightbox - Design Specifications from Mocks

**Analysis of your 8 UI design mocks to inform implementation**

---

## Mock Files Analysis

### 1. yet-another-react-lightbox.jpg
**Reference library baseline**
- Shows minimal, centered modal
- Simple arrow buttons on sides
- No toolbar at bottom
- Generic styling
- **Your design is significantly different** → Build from scratch confirmed

---

### 2. lightbox-ui-horizontal-showcase-copy.jpg
**Horizontal Layout Variant (Default Desktop)**

**Key Features:**
- Full-width image display (primary content area)
- **Thumbnails carousel at bottom** (horizontal scroll, not grid)
- Thumbnail size: ~80-100px each
- Toolbar above thumbnails with controls
- Dark semi-transparent background

**Components Needed:**
```typescript
<HorizontalLayout>
 <ImageRenderer />
 <LightboxChrome controls={...} />
 <ThumbnailCarousel />
</HorizontalLayout>
```

**Sizing:**
- Image area: Full available space minus 120px (toolbar + thumbnails)
- Thumbnail height: 100px
- Toolbar height: 48px
- Max width: 90vw

---

### 3. lightbox-ui-vertical-split-layout-copy.jpg
**Vertical Split Layout (Premium/Tablet)**

**Key Features:**
- **Two-column layout:** Content (left ~65%) | Controls (right ~35%)
- Image on left side (full height)
- Controls stacked vertically on right:
 - Navigation buttons
 - Counter
 - Thumbnails carousel (vertical scroll)
 - Download/Share/Fullscreen buttons
- Clean vertical divider between columns

**Components Needed:**
```typescript
<VerticalSplitLayout>
 <ContentArea>
 <ImageRenderer />
 </ContentArea>
 <ControlsArea>
 <LightboxChrome />
 <ThumbnailCarousel orientation="vertical" />
 </ControlsArea>
</VerticalSplitLayout>
```

**Sizing:**
- Split ratio: 65% / 35%
- Responsive: On tablet width <1024px, switches to horizontal
- Thumbnail carousel: 60px width (when vertical)

---

### 4. lightbox-ui-custom-slides-1-copy.jpg
**Custom Slide Layout with Text Overlay**

**Key Features:**
- Full image displayed
- **Semi-transparent dark overlay** in lower portion
- Text content overlaid on image:
 - Title/heading
 - Description
 - Optional metadata
- Branded appearance with custom styling

**Implementation:**
```typescript
interface CustomSlideItem extends LightboxItem {
 overlayText?: {
 title?: string;
 description?: string;
 author?: string;
 };
 overlayOpacity?: 0.3-0.9;
}

<CustomSlideLayout>
 <ImageRenderer />
 <SlideOverlay>
 <h2>{title}</h2>
 <p>{description}</p>
 </SlideOverlay>
</CustomSlideLayout>
```

**Styling Notes:**
- Dark overlay: rgba(0, 0, 0, 0.6-0.7)
- Text: White, readable typography
- Padding: 20-24px
- Border radius: Subtle top corners

---

### 5. lightbox-ui-custom-slides-2-copy.jpg
**Multiple Slide Carousel with Descriptions**

**Key Features:**
- Similar to custom slides but optimized for **carousel/slideshow**
- Show 1-2 slides at a time
- Previous/Next navigation prominent
- Description below each slide
- Numbered pagination visible

**Components:**
```typescript
<CustomSlideLayout
 items={multipleSlides}
 layout="carousel"
 showPagination={true}
/>
```

**Behavior:**
- Auto-scroll: Optional (5-10s per slide)
- Manual navigation: Prominent prev/next buttons
- Touch: Swipe to next slide

---

### 6. lightbox-ui-vertical-video-showcase-copy.jpg
**Video-Optimized Layout (Tall Viewport)**

**Key Features:**
- **Tall, narrow aspect ratio** (video-optimized)
- Video player with native controls
- Play button overlay (paused state)
- Title below video
- Metadata/description visible

**Implementation:**
```typescript
<VideoRenderer item={videoItem}>
 {/* Native video with custom controls or */}
 {/* @opensite/video with progressive enhancement */}
</VideoRenderer>
```

**Sizing:**
- Aspect ratio: 9:16 or 16:10 (depends on video)
- Full height of viewport
- Responsive: Scales on mobile

---

### 7. lightbox-ui-horizontal-video-showcase-copy.jpg
**Video-Optimized Layout (Wide Viewport)**

**Key Features:**
- **Wide, short aspect ratio** (widescreen)
- Video player centered
- Full-width video display
- Controls below or integrated into player

**Implementation:**
- Responsive detection:
 ```typescript
 if (videoAspectRatio > 1) {
 // Landscape: use full width
 } else {
 // Portrait: use tall layout
 }
 ```

---

### 8. lightbox-ui-pdf-copy.jpg
**PDF Viewer Integration**

**Key Features:**
- Full-page PDF display
- **Page controls integrated into lightbox toolbar**
 - Previous page (disabled if page 1)
 - Page number input (current / total)
 - Next page (disabled if last page)
- **Zoom controls** (+ / -)
- Scrollable PDF content
- Download button (original PDF)
- Share button (link to PDF)

**Implementation:**
```typescript
<PDFRenderer item={pdfItem}>
 <PDFViewer
 url={linearizedPdfUrl}
 showControls={true}
 height="100%"
 />
</PDFRenderer>
```

**Integration with @page-speed/pdf-viewer:**
- Use the PDF viewer module you researched earlier
- Integrate controls into lightbox chrome
- Support page navigation via lightbox next/prev
- Linearized PDF for fast loading

**Key Note:** Your design explicitly shows PDF support as a **primary use case** (restaurant menus, catalogs). This is a **major differentiator** from yet-another-react-lightbox!

---

## Design System Elements

### Color Palette (Extracted from Mocks)

```css
/* Backgrounds */
--overlay-bg: rgba(0, 0, 0, 0.85); /* Dark overlay */
--modal-bg: var(--color-surface); /* White/light surface */
--toolbar-bg: rgba(0, 0, 0, 0.5); /* Semi-transparent dark toolbar */

/* Text */
--text-primary: rgba(255, 255, 255, 1); /* White on dark */
--text-secondary: rgba(255, 255, 255, 0.7); /* Muted white */

/* Borders & Dividers */
--border-color: rgba(255, 255, 255, 0.1); /* Subtle light border */
--divider-color: rgba(0, 0, 0, 0.1); /* Subtle dark divider */
```

### Typography

```css
/* Titles (in overlays) */
font-size: 24px;
font-weight: 600;
line-height: 1.3;

/* Description text */
font-size: 14px;
font-weight: 400;
line-height: 1.5;

/* Counter / Captions */
font-size: 12px;
font-weight: 500;
color: var(--text-secondary);

/* Button text */
font-size: 14px;
font-weight: 500;
```

### Spacing & Sizing

```css
/* Toolbar height */
--toolbar-height: 48-56px;

/* Button sizing */
--button-size: 40-48px;
--button-padding: 8-12px;

/* Thumbnails */
--thumbnail-size: 80-100px (desktop), 60px (tablet), 48px (mobile);
--thumbnail-gap: 8-12px;

/* Modal padding */
--modal-padding: 16-24px;
--border-radius: 8-12px;
```

### Interactions

**Hover States:**
- Buttons: Slight background lightening
- Thumbnails: Scale up 1.05x + border highlight
- Smooth transitions: 150ms ease

**Active States:**
- Selected thumbnail: Bright border highlight
- Pressed buttons: Darker background

---

## Layout Responsive Breakpoints

### Mobile (<768px)
```css
Layout: fullscreen (no whitespace)
Thumbnails: Hidden by default (tap icon to show)
Toolbar: Bottom (fixed)
Controls: Minimized (only essential buttons)
Video: Full viewport height
PDF: Scrollable, zoom out for page fit
```

**Specific Sizes:**
- Toolbar height: 44px
- Button size: 40px
- Font size: 12px (smaller)
- Modal padding: 12px

### Tablet (768px - 1023px)
```css
Layout: vertical-split (preferred)
OR: horizontal (alternative)
Thumbnails: Visible as carousel
Toolbar: Integrated into controls area
Controls: All visible
Video: Maintain aspect ratio, center in area
PDF: Full height, horizontal scroll for width
```

**Specific Sizes:**
- Toolbar height: 48px
- Button size: 44px
- Thumbnail size: 60px

### Desktop (1024px+)
```css
Layout: horizontal (default)
Alternative: vertical-split for premium look
Thumbnails: Carousel below content
Toolbar: Above or integrated
Controls: All visible + enriched
Video: Full width × aspect ratio
PDF: Fit to page with zoom controls
```

**Specific Sizes:**
- Toolbar height: 56px
- Button size: 48px
- Thumbnail size: 100px
- Max width: 90vw
- Modal padding: 24px

---

## Design Tokens (CSS Custom Properties)

```css
:root {
 /* Colors */
 --lightbox-overlay: rgba(0, 0, 0, 0.85);
 --lightbox-toolbar: rgba(0, 0, 0, 0.5);
 --lightbox-text: rgba(255, 255, 255, 1);
 --lightbox-text-muted: rgba(255, 255, 255, 0.7);
 --lightbox-border: rgba(255, 255, 255, 0.1);

 /* Sizing */
 --lightbox-toolbar-height: 56px;
 --lightbox-button-size: 48px;
 --lightbox-thumbnail-size: 100px;
 --lightbox-padding: 24px;

 /* Typography */
 --lightbox-font-family: system-ui, -apple-system, sans-serif;
 --lightbox-font-size-body: 14px;
 --lightbox-font-size-small: 12px;

 /* Transitions */
 --lightbox-transition: 150ms ease;
}

@media (max-width: 1023px) {
 --lightbox-toolbar-height: 48px;
 --lightbox-button-size: 44px;
 --lightbox-thumbnail-size: 60px;
 --lightbox-padding: 16px;
}

@media (max-width: 767px) {
 --lightbox-toolbar-height: 44px;
 --lightbox-button-size: 40px;
 --lightbox-padding: 12px;
}
```

---

## Implementation Checklist (From Design)

- [ ] **Layouts**
 - [ ] Horizontal (thumbnails below)
 - [ ] Vertical-split (content | controls)
 - [ ] Custom-slide (overlays with text)
 - [ ] Fullscreen (mobile default)

- [ ] **Content Types**
 - [ ] Images (static, lazy-loaded)
 - [ ] Videos (with @opensite/video integration)
 - [ ] PDFs (with @page-speed/pdf-viewer integration)
 - [ ] Custom components (React elements)

- [ ] **Controls**
 - [ ] Previous/Next buttons
 - [ ] Counter display
 - [ ] Download button
 - [ ] Share menu (social platforms)
 - [ ] Fullscreen toggle
 - [ ] Close button
 - [ ] Thumbnail carousel

- [ ] **Responsive**
 - [ ] Mobile (<768px): Fullscreen, minimal controls
 - [ ] Tablet (768-1023px): Vertical-split preferred
 - [ ] Desktop (1024px+): Horizontal default

- [ ] **Interactions**
 - [ ] Keyboard navigation (arrows, space, escape)
 - [ ] Swipe gestures (mobile)
 - [ ] Click/tap to navigate
 - [ ] Hover states on buttons/thumbnails

- [ ] **Accessibility**
 - [ ] Aria labels
 - [ ] Keyboard focus indicators
 - [ ] Color contrast (4.5:1+)
 - [ ] Screen reader compatible

- [ ] **Performance**
 - [ ] Lazy-load images
 - [ ] Lazy-load videos (on-demand)
 - [ ] Lazy-load PDFs (@page-speed/pdf-viewer)
 - [ ] <25 KB base bundle

---

## Final Note

Your design shows maturity and polish. Key differentiators from generic lightbox libraries:

✅ Native PDF support (restaurant use case!)
✅ Multiple layout variants (not one-size-fits-all)
✅ Professional styling (not minimal/utilitarian)
✅ Responsive-first thinking
✅ Rich control set without bloat

Building from scratch (not forking) is 100% the right call.