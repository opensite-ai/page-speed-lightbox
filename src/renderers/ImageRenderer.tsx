import React from "react";
import { LightboxItem, LightboxLayoutType } from "../types";
import styles from "../styles/Lightbox.module.css";

interface ImageRendererProps {
  item: LightboxItem;
  layout: LightboxLayoutType;
}

/**
 * Basic image renderer.
 *
 * This intentionally uses a plain <img> tag so consuming apps can decide
 * whether to wrap or replace it with @opensite/img when used inside the
 * Semantic Site Builder.
 */
export function ImageRenderer({ item }: ImageRendererProps) {
  if (!item.src) return null;

  return (
    <img
      className={styles.media}
      src={item.src}
      srcSet={item.srcSet}
      alt={item.alt || item.title || ""}
      loading="lazy"
    />
  );
}
