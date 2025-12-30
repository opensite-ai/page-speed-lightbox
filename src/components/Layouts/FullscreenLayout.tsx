import React from "react";
import { cn } from "../../lib/utils";

interface FullscreenLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Fullscreen layout: takes up the entire viewport with minimal chrome.
 * Ideal for mobile devices and immersive viewing experiences.
 */
export function FullscreenLayout({
  content,
  chrome,
  className,
  style,
}: FullscreenLayoutProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={style}
    >
      <div
        className={cn(
          "relative flex-1 min-h-0",
          "flex items-center justify-center",
          className
        )}
      >
        {/* Content area */}
        <div className="w-full h-full flex items-center justify-center">
          {content}
        </div>
        {/* Chrome (floating controls) */}
        {chrome}
      </div>
    </div>
  );
}
