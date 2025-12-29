import { LightboxProps } from "../types";
import { useGalleryState } from "./useGalleryState";
import { useLightboxState } from "./useLightboxState";

/**
 * Main hook for controlling lightbox state and behavior
 *
 * @param props - Partial lightbox configuration
 * @returns Lightbox API with state and control methods
 */
export function useLightbox(props?: Partial<LightboxProps>) {
  const {
    items = [],
    initialIndex = 0,
    onSelect,
    onOpen,
    onClose,
    disableScroll = true,
  } = props || {};

  // Gallery navigation state
  const galleryState = useGalleryState({
    items,
    initialIndex,
    onSelect,
  });

  // Lightbox open/close state
  const lightboxState = useLightboxState({
    onOpen,
    onClose,
    disableScroll,
  });

  return {
    // State
    items,
    currentIndex: galleryState.currentIndex,
    currentItem: galleryState.currentItem,
    isOpen: lightboxState.isOpen,

    // Navigation
    canNext: galleryState.canNext,
    canPrev: galleryState.canPrev,
    next: galleryState.next,
    prev: galleryState.prev,
    goTo: galleryState.goToIndex,

    // Lightbox control
    open: lightboxState.open,
    close: lightboxState.close,
  };
}
