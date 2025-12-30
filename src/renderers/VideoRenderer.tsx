import React from "react";
import { LightboxItem, LightboxLayoutType } from "../types";

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
      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
      src={item.src}
      controls
      playsInline
    />
  );
}
