import React from "react";
import { cn } from "../../lib/utils";

interface InlineLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Inline layout: renders the lightbox content inline on the page without
 * the modal overlay. Useful for embedding galleries directly in page flow.
 */
export function InlineLayout({
  content,
  chrome,
  height,
  maxWidth,
  className,
  style,
}: InlineLayoutProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth,
    height,
    ...style,
  };

  return (
    <div
      className={cn(
        "relative w-full",
        "overflow-hidden rounded-xl",
        "bg-neutral-100",
        className
      )}
      style={containerStyle}
    >
      {/* Content area */}
      <div className="relative w-full">
        {content}
      </div>
      {/* Toolbar */}
      <div className={cn(
        "flex items-center justify-between",
        "px-3 py-2",
        "bg-neutral-900/90 text-white",
        "border-t border-white/10"
      )}>
        {chrome}
      </div>
    </div>
  );
}
