import React from "react";
import { cn } from "../../lib/utils";

interface HorizontalLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Default desktop layout: primary content area with chrome below.
 * Based on the design mockups showing a large content card with
 * thumbnail strip and navigation at the bottom.
 */
export function HorizontalLayout({
  content,
  chrome,
  height,
  maxWidth,
  className,
  style,
}: HorizontalLayoutProps) {
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
        <div className={cn(
          "relative flex-1 min-h-0",
          "flex items-center justify-center",
          "overflow-hidden rounded-xl",
          "bg-white shadow-2xl"
        )}>
          {content}
        </div>
        {/* Chrome/toolbar area */}
        {chrome}
      </div>
    </div>
  );
}
