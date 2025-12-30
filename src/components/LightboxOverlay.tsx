import React from "react";
import { cn } from "../lib/utils";

interface LightboxOverlayProps {
  onClose?: () => void;
  closeOnBackdropClick?: boolean;
  className?: string;
}

/**
 * Full-screen dark overlay that sits behind the lightbox content.
 *
 * Uses a subtle grid pattern background matching the design mockups.
 * Kept intentionally minimal so it works well with the Semantic Site
 * Builder and external layout containers.
 */
export function LightboxOverlay({
  onClose,
  closeOnBackdropClick = true,
  className,
}: LightboxOverlayProps) {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!closeOnBackdropClick) return;
    if (event.target !== event.currentTarget) return;
    onClose?.();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/90",
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]",
        "bg-[size:24px_24px]",
        className
      )}
      aria-hidden="true"
      onClick={handleClick}
    />
  );
}
