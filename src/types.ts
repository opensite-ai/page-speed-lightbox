import type { OptixFlowConfig as ImgOptixFlowConfig } from "@page-speed/img";
export type LightboxLayoutType =
  | "horizontal"
  | "horizontal-showcase"
  | "vertical-split"
  | "vertical-peek"
  | "custom-slide"
  | "fullscreen"
  | "inline";

export type LightboxChromeVariant = "toolbar" | "floating";

export type LightboxThumbnailsPosition = "bottom" | "sidebar" | "none";

export type LightboxThumbnailsVariant = "strip" | "grid";

export type LightboxItemType = "image" | "video" | "pdf" | "component";

export interface LightboxDownload {
  enabled?: boolean;
  url?: string;
  filename?: string;
}

export interface LightboxShare {
  enabled?: boolean;
  platforms?: Array<
    "facebook" | "twitter" | "pinterest" | "linkedin" | "email" | "copy"
  >;
  url?: string;
  title?: string;
}

	/**
	 * OptixFlow configuration accepted by the lightbox.
	 *
	 * This mirrors the core OptixFlowConfig used across OpenSite UI blocks,
	 * while adapting to the underlying @page-speed/img configuration
	 * (which expects `compressionLevel`).
	 */
	export type LightboxOptixFlowConfig = ImgOptixFlowConfig & {
	  /**
	   * Convenience alias matching the common `compression` prop.
	   * If provided, it will override `compressionLevel` when passed
	   * through to the underlying <Img /> component.
	   */
	  compression?: number;
	};
	
export interface LightboxItem {
  id: string;
  type: LightboxItemType;
  src?: string;
  mediaId?: string;
  srcSet?: string;
  alt?: string;
  caption?: string;
  title?: string;
  thumbnail?: string;
  download?: LightboxDownload | boolean;
  share?: LightboxShare | boolean;
  data?: Record<string, any>;
  component?: React.ComponentType<any>;
}

export interface LightboxControls {
  navigation?: boolean;
  keyboard?: boolean;
  mouseWheel?: boolean;
  swipe?: boolean;
  thumbnails?: boolean;
  counter?: boolean;
  captions?: boolean;
  zoom?: boolean;
  download?: boolean;
  share?: boolean;
  fullscreen?: boolean;
  closeButton?: boolean;
}

export interface LightboxThumbnailsConfig {
  position?: LightboxThumbnailsPosition;
  variant?: LightboxThumbnailsVariant;
  size?: "sm" | "md" | "lg";
  showOnMobile?: boolean;
}

export interface LightboxProps {
  items: LightboxItem[];
  initialIndex?: number;
  layout?: LightboxLayoutType;
  height?: string | number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
  controls?: Partial<LightboxControls>;
  /**
   * OptixFlow image optimization configuration to pass through to
   * the underlying @page-speed/img <Img /> component.
   */
  optixFlowConfig?: LightboxOptixFlowConfig;
  /**
   * Custom sidebar content for vertical-split layout.
   * Renders in the right sidebar area alongside the main content.
   */
  sidebar?: React.ReactNode;
  /**
   * Custom footer content for layouts that support it.
   * Renders below the main content area (e.g., info cards, metadata).
   */
  footer?: React.ReactNode;
  /**
   * Chrome UI variant: "toolbar" for traditional bottom bar,
   * "floating" for floating buttons around the viewport.
   */
  chromeVariant?: LightboxChromeVariant;
  /**
   * Thumbnails configuration for gallery navigation.
   */
  thumbnails?: LightboxThumbnailsConfig;
  /**
   * Enable smooth CSS animations for slide transitions.
   * Respects prefers-reduced-motion automatically.
   */
  enableAnimations?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSelect?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  enableDeepLinking?: boolean;
  enableKeyboardShortcuts?: boolean;
  disableScroll?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}
