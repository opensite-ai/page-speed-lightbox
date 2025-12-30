import React from "react";
import { cn } from "../../lib/utils";

interface CustomSlideLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Custom slide layout: optimized for PDF/slide presentations.
 * Based on the design mockups showing a centered white card with
 * rounded corners containing the slide content.
 */
export function CustomSlideLayout({
  content,
  chrome,
  height,
  maxWidth,
  className,
  style,
}: CustomSlideLayoutProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth,
    height,
    ...style,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12"
      style={containerStyle}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center",
          "w-full max-w-5xl max-h-full",
          className
        )}
      >
        {/* Slide content area */}
        <div className={cn(
          "relative w-full",
          "flex items-center justify-center",
          "overflow-hidden rounded-2xl",
          "bg-white shadow-2xl"
        )}>
          {content}
        </div>
        {/* Chrome (floating controls) */}
        {chrome}
      </div>
    </div>
  );
}
