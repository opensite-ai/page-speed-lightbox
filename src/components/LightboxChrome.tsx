import React from "react";
import { LightboxControls, LightboxItem } from "../types";
import styles from "../styles/Lightbox.module.css";

interface LightboxChromeProps {
  currentIndex: number;
  totalItems: number;
  currentItem: LightboxItem | null;
  canNext: boolean;
  canPrev: boolean;
  controls?: Partial<LightboxControls>;
  onNext: () => void;
  onPrev: () => void;
  onClose?: () => void;
}

const DEFAULT_CONTROLS: LightboxControls = {
  navigation: true,
  keyboard: true,
  mouseWheel: false,
  swipe: true,
  thumbnails: false,
  counter: true,
  captions: true,
  zoom: false,
  download: false,
  share: false,
  fullscreen: false,
  closeButton: true,
};

function mergeControls(overrides?: Partial<LightboxControls>): LightboxControls {
  return { ...DEFAULT_CONTROLS, ...(overrides || {}) };
}

/**
 * Toolbar / chrome shown above or below the main content.
 *
 * For v1 this focuses on navigation, close button, basic captions, and
 * counter. More advanced controls (share, download, fullscreen) can be
 * layered in later without breaking the API.
 */
export function LightboxChrome({
  currentIndex,
  totalItems,
  currentItem,
  canNext,
  canPrev,
  controls,
  onNext,
  onPrev,
  onClose,
}: LightboxChromeProps) {
  const resolved = mergeControls(controls);

  return (
    <div className={styles.chrome}>
      {resolved.navigation && (
        <div className={styles.chromeSection}>
          <button
            type="button"
            className={styles.navButton}
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous item"
          >
            {"\u2039"}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next item"
          >
            {"\u203a"}
          </button>
        </div>
      )}

      <div className={styles.chromeSection}>
        {resolved.captions && currentItem && (
          <div className={styles.captionContainer}>
            {currentItem.title && (
              <div className={styles.captionTitle}>{currentItem.title}</div>
            )}
            {currentItem.caption && (
              <div className={styles.captionText}>{currentItem.caption}</div>
            )}
          </div>
        )}
      </div>

      <div className={styles.chromeSection}>
        {resolved.counter && totalItems > 0 && (
          <span className={styles.counter}>
            {currentIndex + 1} / {totalItems}
          </span>
        )}

        {resolved.closeButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close lightbox"
          >
            {"\u00d7"}
          </button>
        )}
      </div>
    </div>
  );
}
