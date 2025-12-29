import React from "react";
import styles from "../../styles/Lightbox.module.css";

interface CustomSlideLayoutProps {
  content: React.ReactNode;
  chrome: React.ReactNode;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Custom slide layout: optimized for component-type items where you want
 * full creative control over the slide content. Chrome is overlaid or minimal.
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
    <div className={styles.customSlideLayoutRoot} style={containerStyle}>
      <div
        className={[
          styles.customSlideLayoutContainer,
          className || "",
        ].join(" ").trim()}
      >
        <div className={styles.customSlideContent}>{content}</div>
        <div className={styles.customSlideChrome}>{chrome}</div>
      </div>
    </div>
  );
}
