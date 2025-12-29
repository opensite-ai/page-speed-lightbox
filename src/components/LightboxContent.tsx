import React from "react";
import {
  LightboxItem,
  LightboxLayoutType,
  LightboxOptixFlowConfig,
} from "../types";
import { ImageRenderer } from "../renderers/ImageRenderer";
import { VideoRenderer } from "../renderers/VideoRenderer";
import { PDFRenderer } from "../renderers/PDFRenderer";
import { ComponentRenderer } from "../renderers/ComponentRenderer";

interface LightboxContentProps {
	  item: LightboxItem | null;
	  layout: LightboxLayoutType;
	  optixFlowConfig?: LightboxOptixFlowConfig;
	}

/**
 * Dispatches to the appropriate renderer based on the LightboxItem type.
 *
 * This component stays very small so individual renderers can be
 * tree-shaken and swapped out by the Semantic UI engine if needed.
 */
export function LightboxContent({ item, layout, optixFlowConfig }: LightboxContentProps) {
  if (!item) return null;

  switch (item.type) {
    case "image":
	      return (
	        <ImageRenderer
	          item={item}
	          layout={layout}
	          optixFlowConfig={optixFlowConfig}
	        />
	      );
    case "video":
      return <VideoRenderer item={item} layout={layout} />;
    case "pdf":
      return <PDFRenderer item={item} layout={layout} />;
    case "component":
      return <ComponentRenderer item={item} />;
    default:
      return null;
  }
}
