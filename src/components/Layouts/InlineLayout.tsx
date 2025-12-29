import React from "react";
import styles from "../../styles/Lightbox.module.css";

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
    <div className={styles.inlineLayoutRoot} style={containerStyle}>
      <div
        className={[
          styles.inlineLayoutContainer,
          className || "",
        ].join(" ").trim()}
      >
        <div className={styles.inlineContent}>{content}</div>
        <div className={styles.inlineToolbar}>{chrome}</div>
      </div>
    </div>
  );
}
