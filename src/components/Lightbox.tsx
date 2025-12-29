import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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

  // Handle body scroll locking while the lightbox is mounted.
  useEffect(() => {
    props.onOpen?.();

    if (props.disableScroll === false) {
      return () => {
        if (!didCloseRef.current) {
          props.onClose?.();
        }
      };
    }

    if (typeof document === "undefined") {
      return () => {
        if (!didCloseRef.current) {
          props.onClose?.();
        }
      };
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (!didCloseRef.current) {
        props.onClose?.();
      }
    };
  }, [props.disableScroll, props.onOpen, props.onClose]);

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

  return (
    <div className={styles.lightboxPortal} role="dialog" aria-modal="true">
      <LightboxOverlay
        onClose={handleClose}
        closeOnBackdropClick={props.closeOnBackdropClick ?? true}
      />

      <HorizontalLayout
	        content={
	          <LightboxContent
	            item={currentItem}
	            layout={layout}
	            optixFlowConfig={props.optixFlowConfig}
	          />
	        }
        chrome={
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
        }
        height={props.height}
        maxWidth={props.maxWidth}
        className={props.className}
        style={props.style}
      />
    </div>
  );
}
