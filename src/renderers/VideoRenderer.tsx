import React from "react";
import { LightboxItem, LightboxLayoutType } from "../types";
import styles from "../styles/Lightbox.module.css";

interface VideoRendererProps {
  item: LightboxItem;
  layout: LightboxLayoutType;
}

/**
 * Basic HTML5 video renderer.
 *
 * For production Semantic Site Builder usage, this can be swapped for
 * @opensite/video via composition without changing the Lightbox API.
 */
export function VideoRenderer({ item }: VideoRendererProps) {
  if (!item.src) return null;

  return (
    <video
      className={styles.media}
      src={item.src}
      controls
      playsInline
    />
  );
}
