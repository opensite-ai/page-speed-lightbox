import React from "react";
import { Img } from "@page-speed/img";
import type {
  LightboxItem,
  LightboxLayoutType,
  LightboxOptixFlowConfig,
} from "../types";
import type { OptixFlowConfig as ImgOptixFlowConfig } from "@page-speed/img";

interface ImageRendererProps {
  item: LightboxItem;
  layout: LightboxLayoutType;
  optixFlowConfig?: LightboxOptixFlowConfig;
}

const toImgOptixFlowConfig = (
  config?: LightboxOptixFlowConfig
): ImgOptixFlowConfig | undefined => {
  if (!config) return undefined;
  const { compression, ...rest } = config;
  const base = rest as ImgOptixFlowConfig;
  return {
    ...base,
    compressionLevel:
      typeof compression === "number" ? compression : base.compressionLevel,
  };
};

/**
 * Basic image renderer using @page-speed/img for optimized delivery.
 *
 * Consuming apps can still swap this out by providing a custom renderer
 * via the Semantic Site Builder, but the default integrates the shared
 * <Img /> component and OptixFlow configuration.
 */
export function ImageRenderer({ item, optixFlowConfig }: ImageRendererProps) {
  if (!item.src) return null;

  return (
    <Img
      className="max-w-full max-h-full w-auto h-auto object-contain"
      src={item.src}
      alt={item.alt || item.title || ""}
      loading="lazy"
      optixFlowConfig={toImgOptixFlowConfig(optixFlowConfig)}
    />
  );
}
