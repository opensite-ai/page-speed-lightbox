import React from "react";
import styles from "../../styles/Lightbox.module.css";

interface VerticalSplitLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Vertical split layout: content on the left, chrome/controls on the right.
 * Ideal for tablet and medium-sized viewports where you want side-by-side
 * media and metadata/controls.
 */
export function VerticalSplitLayout({
  content,
  chrome,
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
    <div className={styles.verticalSplitLayoutRoot} style={containerStyle}>
      <div
        className={[
          styles.verticalSplitLayoutContainer,
          className || "",
        ].join(" ").trim()}
      >
        <div className={styles.verticalSplitContent}>{content}</div>
        <div className={styles.verticalSplitSidebar}>{chrome}</div>
      </div>
    </div>
  );
}
