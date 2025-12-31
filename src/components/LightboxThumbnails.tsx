import React from "react";
import { cn } from "../lib/utils";
import {
  LightboxItem,
  LightboxThumbnailsConfig,
} from "../types";

interface LightboxThumbnailsProps {
  items: LightboxItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  config?: LightboxThumbnailsConfig;
  className?: string;
}

const DEFAULT_CONFIG: LightboxThumbnailsConfig = {
  position: "bottom",
  variant: "strip",
  size: "md",
  showOnMobile: false,
};

function mergeConfig(
  overrides?: LightboxThumbnailsConfig
): LightboxThumbnailsConfig {
  return { ...DEFAULT_CONFIG, ...(overrides || {}) };
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

/**
 * Thumbnail navigation component for the lightbox.
 *
 * Supports two variants:
 * - "strip": Horizontal scrollable strip of thumbnails
 * - "grid": Grid layout for sidebar placement
 *
 * Thumbnails use the item's `thumbnail` property if available,
 * falling back to `src` for images.
 */
export function LightboxThumbnails({
  items,
  currentIndex,
  onSelect,
  config,
  className,
}: LightboxThumbnailsProps) {
  const resolved = mergeConfig(config);

  if (resolved.position === "none" || items.length <= 1) {
    return null;
  }

  const getThumbnailSrc = (item: LightboxItem): string | undefined => {
    if (item.thumbnail) return item.thumbnail;
    if (item.type === "image" && item.src) return item.src;
    return undefined;
  };

  const isStrip = resolved.variant === "strip";

  return (
    <div
      className={cn(
        "flex gap-2",
        isStrip ? "overflow-x-auto pb-2" : "flex-wrap",
        !resolved.showOnMobile && "hidden md:flex",
        className
      )}
    >
      {items.map((item, index) => {
        const thumbnailSrc = getThumbnailSrc(item);
        const isActive = index === currentIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative flex-shrink-0 rounded-lg overflow-hidden",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              sizeClasses[resolved.size || "md"],
              isActive
                ? "ring-2 ring-white opacity-100"
                : "opacity-60 hover:opacity-100"
            )}
          >
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={item.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center",
                  "bg-neutral-700 text-neutral-400"
                )}
              >
                {item.type === "video" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
                {item.type === "pdf" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
                {item.type === "component" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
