import React from "react";
import styles from "../../styles/Lightbox.module.css";

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
    <div className={styles.fullscreenLayoutRoot} style={style}>
      <div
        className={[
          styles.fullscreenLayoutContainer,
          className || "",
        ].join(" ").trim()}
      >
        <div className={styles.fullscreenContent}>{content}</div>
        <div className={styles.fullscreenChrome}>{chrome}</div>
      </div>
    </div>
  );
}
