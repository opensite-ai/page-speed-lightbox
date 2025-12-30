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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Handle fullscreen
  const handleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle share
  const handleShare = React.useCallback(async () => {
    if (!currentItem) return;

    const shareData = {
      title: currentItem.title || 'Shared item',
      text: currentItem.caption || '',
      url: window.location.href,
    };

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
        console.log('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [currentItem]);

  // Handle download
  const handleDownload = React.useCallback(async () => {
    if (!currentItem?.src) return;

    try {
      // Fetch the resource
      const response = await fetch(currentItem.src);
      const blob = await response.blob();

      // Determine file extension from Content-Type, URL, or item type
      const getFileExtension = (): string => {
        // Try to get extension from Content-Type header
        const contentType = response.headers.get('Content-Type');
        if (contentType) {
          const mimeToExt: Record<string, string> = {
            'application/pdf': '.pdf',
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'image/svg+xml': '.svg',
            'video/mp4': '.mp4',
            'video/webm': '.webm',
            'video/quicktime': '.mov',
          };
          const baseMime = contentType.split(';')[0].trim().toLowerCase();
          if (mimeToExt[baseMime]) {
            return mimeToExt[baseMime];
          }
        }

        // Try to extract extension from URL pathname
        try {
          const urlObj = new URL(currentItem.src!, window.location.origin);
          const pathname = urlObj.pathname;
          const lastDotIndex = pathname.lastIndexOf('.');
          if (lastDotIndex > pathname.lastIndexOf('/')) {
            const ext = pathname.substring(lastDotIndex).toLowerCase();
            // Validate it's a reasonable extension (2-5 chars)
            if (ext.length >= 2 && ext.length <= 6) {
              return ext;
            }
          }
        } catch {
          // URL parsing failed
        }

        // Fall back to item type
        const typeToExt: Record<string, string> = {
          'pdf': '.pdf',
          'image': '.jpg',
          'video': '.mp4',
        };
        if (currentItem.type && typeToExt[currentItem.type]) {
          return typeToExt[currentItem.type];
        }

        // Default extension
        return '';
      };

      // Build filename with extension
      const baseName = currentItem.title || 'download';
      const extension = getFileExtension();
      // Only add extension if the filename doesn't already have one
      const hasExtension = baseName.includes('.') && baseName.lastIndexOf('.') > baseName.length - 6;
      const filename = hasExtension ? baseName : `${baseName}${extension}`;

      // Create object URL
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(currentItem.src, '_blank');
    }
  }, [currentItem]);

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
          {resolved.share && 'share' in navigator && (
            <IconButton onClick={handleShare} ariaLabel="Share">
              <ShareIcon />
            </IconButton>
          )}
          {resolved.fullscreen && (
            <IconButton onClick={handleFullscreen} ariaLabel={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              <FullscreenIcon />
            </IconButton>
          )}
          {resolved.download && currentItem?.src && (
            <IconButton onClick={handleDownload} ariaLabel="Download">
              <DownloadIcon />
            </IconButton>
          )}
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
        {resolved.share && 'share' in navigator && (
          <IconButton onClick={handleShare} ariaLabel="Share">
            <ShareIcon />
          </IconButton>
        )}
        {resolved.fullscreen && (
          <IconButton onClick={handleFullscreen} ariaLabel={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            <FullscreenIcon />
          </IconButton>
        )}
        {resolved.download && currentItem?.src && (
          <IconButton onClick={handleDownload} ariaLabel="Download">
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
