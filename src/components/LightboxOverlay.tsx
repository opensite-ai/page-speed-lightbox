import React from "react";
import styles from "../styles/Lightbox.module.css";

interface LightboxOverlayProps {
  onClose?: () => void;
  closeOnBackdropClick?: boolean;
}

/**
 * Full-screen dark overlay that sits behind the lightbox content.
 *
 * Kept intentionally minimal so it works well with the Semantic Site
 * Builder and external layout containers.
 */
export function LightboxOverlay({
  onClose,
  closeOnBackdropClick = true,
}: LightboxOverlayProps) {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!closeOnBackdropClick) return;
    // Only close when the actual backdrop is clicked, not children.
    if (event.target !== event.currentTarget) return;
    onClose?.();
  };

  return (
    <div
      className={styles.overlay}
      aria-hidden="true"
      onClick={handleClick}
    />
  );
}
