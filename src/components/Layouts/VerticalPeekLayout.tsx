import React from "react";
import { cn } from "../../lib/utils";

interface VerticalPeekLayoutProps {
  content: React.ReactNode;
  prevContent?: React.ReactNode;
  nextContent?: React.ReactNode;
  chrome: React.ReactNode;
  footer?: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}

/**
 * Vertical peek layout: carousel-style display with adjacent slides
 * visible on the sides. Ideal for portrait/vertical video content.
 *
 * Based on the design mockup showing a centered vertical video with
 * partially visible adjacent slides on left and right sides.
 */
export function VerticalPeekLayout({
  content,
  prevContent,
  nextContent,
  chrome,
  footer,
  height,
  maxWidth,
  className,
  style,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: VerticalPeekLayoutProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth,
    height,
    ...style,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8"
      style={containerStyle}
    >
      {/* Carousel container */}
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-full max-w-7xl",
          "gap-4 md:gap-8",
          className
        )}
      >
        {/* Previous slide (peek) */}
        <div
          className={cn(
            "hidden md:flex items-center justify-center",
            "w-32 lg:w-48 flex-shrink-0",
            "opacity-40 scale-90 blur-[1px]",
            "transition-all duration-300",
            canPrev ? "cursor-pointer hover:opacity-60" : "pointer-events-none"
          )}
          onClick={canPrev ? onPrev : undefined}
          role={canPrev ? "button" : undefined}
          aria-label={canPrev ? "Previous slide" : undefined}
        >
          {prevContent && (
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              {prevContent}
            </div>
          )}
        </div>

        {/* Current slide (main content) */}
        <div
          className={cn(
            "relative flex-1 max-w-md lg:max-w-lg",
            "flex items-center justify-center",
            "transition-transform duration-300"
          )}
        >
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
            {content}
          </div>
        </div>

        {/* Next slide (peek) */}
        <div
          className={cn(
            "hidden md:flex items-center justify-center",
            "w-32 lg:w-48 flex-shrink-0",
            "opacity-40 scale-90 blur-[1px]",
            "transition-all duration-300",
            canNext ? "cursor-pointer hover:opacity-60" : "pointer-events-none"
          )}
          onClick={canNext ? onNext : undefined}
          role={canNext ? "button" : undefined}
          aria-label={canNext ? "Next slide" : undefined}
        >
          {nextContent && (
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              {nextContent}
            </div>
          )}
        </div>
      </div>

      {/* Footer area (e.g., video progress bar) */}
      {footer && (
        <div className="mt-6 w-full max-w-md lg:max-w-lg">{footer}</div>
      )}

      {/* Chrome (floating controls) */}
      {chrome}
    </div>
  );
}
