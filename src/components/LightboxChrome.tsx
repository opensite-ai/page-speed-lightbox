import React from "react";
import { LightboxControls, LightboxItem } from "../types";
import { cn } from "../lib/utils";

interface LightboxChromeProps {
  currentIndex: number;
  totalItems: number;
  currentItem: LightboxItem | null;
  canNext: boolean;
  canPrev: boolean;
  controls?: Partial<LightboxControls>;
  onNext: () => void;
  onPrev: () => void;
  onClose?: () => void;
  className?: string;
  variant?: "toolbar" | "floating";
}

const DEFAULT_CONTROLS: LightboxControls = {
  navigation: true,
  keyboard: true,
  mouseWheel: false,
  swipe: true,
  thumbnails: false,
  counter: true,
  captions: true,
  zoom: false,
  download: false,
  share: false,
  fullscreen: false,
  closeButton: true,
};

function mergeControls(overrides?: Partial<LightboxControls>): LightboxControls {
  return { ...DEFAULT_CONTROLS, ...(overrides || {}) };
}

const IconButton = ({
  onClick,
  disabled,
  ariaLabel,
  children,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={cn(
      "flex items-center justify-center",
      "w-10 h-10 rounded-full",
      "bg-neutral-800/80 hover:bg-neutral-700/90",
      "text-white/90 hover:text-white",
      "transition-colors duration-200",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      "focus:outline-none focus:ring-2 focus:ring-white/30",
      className
    )}
  >
    {children}
  </button>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
  </svg>
);

/**
 * Toolbar / chrome for the lightbox.
 *
 * Supports two variants:
 * - "toolbar": Traditional toolbar layout (default)
 * - "floating": Floating buttons positioned around the viewport
 *
 * The floating variant matches the design mockups with:
 * - Top-right action buttons (fullscreen, download, share, close)
 * - Bottom-right navigation arrows
 * - Bottom-left caption card
 */
export function LightboxChrome({
  currentIndex,
  totalItems,
  currentItem,
  canNext,
  canPrev,
  controls,
  onNext,
  onPrev,
  onClose,
  className,
  variant = "floating",
}: LightboxChromeProps) {
  const resolved = mergeControls(controls);

  if (variant === "toolbar") {
    return (
      <div className={cn(
        "flex items-center justify-between",
        "px-3 py-2",
        "bg-black/50 text-white",
        "border-t border-white/10",
        className
      )}>
        {resolved.navigation && (
          <div className="flex items-center gap-2">
            <IconButton onClick={onPrev} disabled={!canPrev} ariaLabel="Previous item">
              <ArrowLeftIcon />
            </IconButton>
            <IconButton onClick={onNext} disabled={!canNext} ariaLabel="Next item">
              <ArrowRightIcon />
            </IconButton>
          </div>
        )}

        <div className="flex flex-col">
          {resolved.captions && currentItem && (
            <>
              {currentItem.title && (
                <div className="text-sm font-semibold">{currentItem.title}</div>
              )}
              {currentItem.caption && (
                <div className="text-xs text-white/70">{currentItem.caption}</div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {resolved.counter && totalItems > 0 && (
            <span className="text-xs text-white/70">
              {currentIndex + 1} / {totalItems}
            </span>
          )}
          {resolved.closeButton && (
            <IconButton onClick={onClose} ariaLabel="Close lightbox">
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top-right action buttons */}
      <div className={cn(
        "fixed top-4 right-4 z-50",
        "flex items-center gap-2",
        className
      )}>
        {resolved.share && (
          <IconButton ariaLabel="Share">
            <ShareIcon />
          </IconButton>
        )}
        {resolved.fullscreen && (
          <IconButton ariaLabel="Fullscreen">
            <FullscreenIcon />
          </IconButton>
        )}
        {resolved.download && (
          <IconButton ariaLabel="Download">
            <DownloadIcon />
          </IconButton>
        )}
        {resolved.closeButton && (
          <IconButton onClick={onClose} ariaLabel="Close lightbox">
            <CloseIcon />
          </IconButton>
        )}
      </div>

      {/* Bottom-right navigation arrows */}
      {resolved.navigation && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <IconButton onClick={onPrev} disabled={!canPrev} ariaLabel="Previous item">
            <ArrowLeftIcon />
          </IconButton>
          <IconButton onClick={onNext} disabled={!canNext} ariaLabel="Next item">
            <ArrowRightIcon />
          </IconButton>
        </div>
      )}

      {/* Bottom-left caption card */}
      {resolved.captions && currentItem && (currentItem.title || currentItem.caption) && (
        <div className={cn(
          "fixed bottom-6 left-6 z-50",
          "max-w-md p-4",
          "bg-white rounded-xl shadow-lg",
          "text-neutral-900"
        )}>
          {currentItem.title && (
            <div className="text-base font-semibold leading-tight">
              {currentItem.title}
            </div>
          )}
          {currentItem.caption && (
            <div className="mt-1 text-sm text-neutral-600 leading-relaxed">
              {currentItem.caption}
            </div>
          )}
          {resolved.counter && totalItems > 1 && (
            <div className="mt-2 text-xs text-neutral-400">
              {currentIndex + 1} of {totalItems}
            </div>
          )}
        </div>
      )}

      {/* Counter only (when no captions) */}
      {resolved.counter && totalItems > 1 && !(resolved.captions && currentItem && (currentItem.title || currentItem.caption)) && (
        <div className="fixed bottom-6 left-6 z-50 px-3 py-1.5 bg-black/70 rounded-full text-white text-sm">
          {currentIndex + 1} / {totalItems}
        </div>
      )}
    </>
  );
}
