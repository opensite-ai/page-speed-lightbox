import React from "react";
import styles from "../../styles/Lightbox.module.css";

interface HorizontalLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Default desktop layout: primary content area with chrome and optional
 * thumbnails below. For v1 we only implement the main content + chrome
 * region; thumbnails can be added later as a non-breaking enhancement.
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
    <div className={styles.horizontalLayoutRoot} style={containerStyle}>
      <div
        className={[
          styles.horizontalLayoutContainer,
          className || "",
        ].join(" ").trim()}
      >
        <div className={styles.mainContent}>{content}</div>
        <div className={styles.toolbar}>{chrome}</div>
      </div>
    </div>
  );
}
