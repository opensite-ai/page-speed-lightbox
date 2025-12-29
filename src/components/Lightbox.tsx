import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  LightboxControls,
  LightboxLayoutType,
  LightboxProps,
  LightboxItem,
} from "../types";
import { useGalleryState } from "../hooks/useGalleryState";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useResponsiveness } from "../hooks/useResponsiveness";
import { LightboxOverlay } from "./LightboxOverlay";
import { LightboxContent } from "./LightboxContent";
import { LightboxChrome } from "./LightboxChrome";
import { HorizontalLayout } from "./Layouts/HorizontalLayout";
import { VerticalSplitLayout } from "./Layouts/VerticalSplitLayout";
import { CustomSlideLayout } from "./Layouts/CustomSlideLayout";
import { FullscreenLayout } from "./Layouts/FullscreenLayout";
import { InlineLayout } from "./Layouts/InlineLayout";
import styles from "../styles/Lightbox.module.css";

/**
 * Main Lightbox component.
 *
 * This component is intentionally controlled from the outside: it renders
 * whenever it is mounted, and callers decide when to mount/unmount it.
 * That keeps it easy to integrate into the Semantic Site Builder while
 * still providing strong defaults for keyboard and scroll handling.
 */
export function Lightbox(props: LightboxProps) {
  const { items, initialIndex = 0 } = props;

  const gallery = useGalleryState({
    items,
    initialIndex,
    onSelect: props.onSelect,
  });

  const { breakpoint } = useResponsiveness();

  const layout: LightboxLayoutType = useMemo(() => {
    if (props.layout) return props.layout;
    if (breakpoint === "mobile") return "fullscreen";
    if (breakpoint === "tablet") return "vertical-split";
    return "horizontal";
  }, [props.layout, breakpoint]);

  // Track whether onClose has already been fired for this mount.
  const didCloseRef = useRef(false);

  // Track whether we're mounted (for SSR safety with portals)
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after initial render (for SSR safety)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle body scroll locking while the lightbox is mounted.
  // Note: We intentionally do NOT call onClose in the cleanup function.
  // The parent component controls visibility via conditional rendering,
  // so it already knows when the lightbox unmounts. Calling onClose during
  // cleanup causes issues with React Strict Mode (double mount/unmount)
  // and creates feedback loops where the cleanup triggers state changes
  // that cause immediate re-unmounting.
  useEffect(() => {
    props.onOpen?.();

    if (props.disableScroll === false) {
      return;
    }

    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [props.disableScroll, props.onOpen]);

  const handleClose = useCallback(() => {
    if (didCloseRef.current) return;
    didCloseRef.current = true;
    props.onClose?.();
  }, [props.onClose]);

  const handleNext = useCallback(() => {
    if (!gallery.canNext) return;
    gallery.next();
    props.onNext?.();
  }, [gallery, props.onNext]);

  const handlePrev = useCallback(() => {
    if (!gallery.canPrev) return;
    gallery.prev();
    props.onPrev?.();
  }, [gallery, props.onPrev]);

  useKeyboardShortcuts(
    {
      ArrowLeft: handlePrev,
      ArrowRight: handleNext,
      Escape: handleClose,
      " ": (event) => {
        event?.preventDefault();
        handleNext();
      },
    },
    props.enableKeyboardShortcuts ?? true
  );

  const currentItem: LightboxItem | null = gallery.currentItem;

  const effectiveControls: Partial<LightboxControls> = {
    navigation: true,
    counter: true,
    closeButton: true,
    thumbnails: false,
    captions: true,
    ...props.controls,
  };

  const contentNode = (
    <LightboxContent
      item={currentItem}
      layout={layout}
      optixFlowConfig={props.optixFlowConfig}
    />
  );

  const chromeNode = (
    <LightboxChrome
      currentIndex={gallery.currentIndex}
      totalItems={items.length}
      currentItem={currentItem}
      canNext={gallery.canNext}
      canPrev={gallery.canPrev}
      controls={effectiveControls}
      onNext={handleNext}
      onPrev={handlePrev}
      onClose={handleClose}
    />
  );

  const layoutProps = {
    content: contentNode,
    chrome: chromeNode,
    height: props.height,
    maxWidth: props.maxWidth,
    className: props.className,
    style: props.style,
  };

  // For inline layout, we don't render the modal overlay or portal
  if (layout === "inline") {
    return <InlineLayout {...layoutProps} />;
  }

  // Render the appropriate layout component based on the layout type
  let layoutComponent: React.ReactNode;
  switch (layout) {
    case "vertical-split":
      layoutComponent = <VerticalSplitLayout {...layoutProps} />;
      break;
    case "custom-slide":
      layoutComponent = <CustomSlideLayout {...layoutProps} />;
      break;
    case "fullscreen":
      layoutComponent = <FullscreenLayout {...layoutProps} />;
      break;
    case "horizontal":
    default:
      layoutComponent = <HorizontalLayout {...layoutProps} />;
      break;
  }

  const lightboxContent = (
    <div className={styles.lightboxPortal} role="dialog" aria-modal="true">
      <LightboxOverlay
        onClose={handleClose}
        closeOnBackdropClick={props.closeOnBackdropClick ?? true}
      />
      {layoutComponent}
    </div>
  );

  // Use a portal to render the lightbox at the document body level.
  // This ensures the lightbox escapes any parent stacking contexts,
  // overflow constraints, or CSS containment that could affect positioning.
  // We only render the portal after mounting to ensure SSR compatibility.
  if (isMounted && typeof document !== "undefined") {
    return createPortal(lightboxContent, document.body);
  }

  // During SSR or before mount, render nothing to avoid hydration mismatches
  return null;
}
