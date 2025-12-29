import type * as React from "react";

declare module "@page-speed/pdf-viewer" {
  export interface PDFViewerProps {
    url: string;
    [key: string]: unknown;
  }

  export const PDFViewer: React.ComponentType<PDFViewerProps>;
}
