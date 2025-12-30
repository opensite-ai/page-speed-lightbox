import React from "react";
import { cn } from "../../lib/utils";

interface VerticalSplitLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  sidebar?: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Vertical split layout: content on the left, sidebar on the right.
 * Based on the design mockups showing a large image with a sidebar
 * containing social media post details and thumbnail grid.
 */
export function VerticalSplitLayout({
  content,
  chrome,
  sidebar,
  height,
  maxWidth,
  className,
  style,
}: VerticalSplitLayoutProps) {
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
          "relative flex flex-col md:flex-row",
          "w-full max-w-7xl max-h-full",
          "gap-4",
          className
        )}
      >
        {/* Main content area */}
        <div className={cn(
          "relative flex-1 min-h-0 md:min-w-0",
          "flex items-center justify-center",
          "overflow-hidden rounded-xl",
          "bg-neutral-900"
        )}>
          {content}
        </div>
        {/* Sidebar area */}
        {sidebar && (
          <div className={cn(
            "w-full md:w-80 lg:w-96",
            "flex flex-col gap-4",
            "overflow-y-auto"
          )}>
            {sidebar}
          </div>
        )}
        {/* Chrome (floating controls) */}
        {chrome}
      </div>
    </div>
  );
}
