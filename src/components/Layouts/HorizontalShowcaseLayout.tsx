import React from "react";
import { cn } from "../../lib/utils";

interface HorizontalShowcaseLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  footer?: React.ReactNode;
  thumbnails?: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Horizontal showcase layout: large content area at top with
 * footer panel below containing caption/metadata on left and
 * thumbnail strip on right.
 *
 * Based on the design mockup showing a large image with
 * caption text on the left and horizontal thumbnail strip on the right.
 */
export function HorizontalShowcaseLayout({
  content,
  chrome,
  footer,
  thumbnails,
  height,
  maxWidth,
  className,
  style,
}: HorizontalShowcaseLayoutProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth,
    height,
    ...style,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={containerStyle}
    >
      <div
        className={cn(
          "relative flex flex-col",
          "w-full max-w-6xl max-h-full",
          "overflow-hidden",
          className
        )}
      >
        {/* Main content area */}
        <div
          className={cn(
            "relative flex-1 min-h-0",
            "flex items-center justify-center",
            "overflow-hidden rounded-xl",
            "bg-white shadow-2xl"
          )}
        >
          {content}
        </div>

        {/* Footer panel with caption and thumbnails */}
        {(footer || thumbnails) && (
          <div
            className={cn(
              "mt-4 flex flex-col md:flex-row items-start md:items-center",
              "gap-4 justify-between"
            )}
          >
            {/* Caption/metadata area */}
            {footer && (
              <div className="flex-shrink-0 max-w-md">{footer}</div>
            )}

            {/* Thumbnail strip */}
            {thumbnails && (
              <div className="flex-1 min-w-0 overflow-hidden">
                {thumbnails}
              </div>
            )}
          </div>
        )}

        {/* Chrome (floating controls) */}
        {chrome}
      </div>
    </div>
  );
}
