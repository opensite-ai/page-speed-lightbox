import React, { Suspense } from "react";
import { LightboxItem, LightboxLayoutType } from "../types";

// The PDF viewer package currently ships JavaScript only. To keep this
// package strictly typed without blocking on external typings, we treat the
// viewer as `any` here and rely on runtime contract testing in the
// pdf-viewer module itself.
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadPDFViewer(): Promise<{ default: any }> {
  // @ts-ignore - @page-speed/pdf-viewer does not ship TypeScript types yet
  return import("@page-speed/pdf-viewer").then((mod) => ({
    // The PDF viewer package exposes a named PDFViewer export.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (mod as any).PDFViewer,
  }));
}

const LazyPDFViewer = React.lazy(loadPDFViewer);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyPDFViewer: any = LazyPDFViewer;

interface PDFRendererProps {
  item: LightboxItem;
  layout: LightboxLayoutType;
}

/**
 * Thin wrapper around @page-speed/pdf-viewer, loaded lazily so that the
 * heavy PDF runtime is only fetched when a PDF item is actually viewed.
 */
export function PDFRenderer({ item }: PDFRendererProps) {
  if (!item.src) return null;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-neutral-500 text-sm">
            Loading document...
          </div>
        }
      >
        <AnyPDFViewer url={item.src} />
      </Suspense>
    </div>
  );
}
