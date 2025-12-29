import React from "react";
import { LightboxItem } from "../types";

interface ComponentRendererProps {
  item: LightboxItem;
}

/**
 * Renders a custom React component provided on the LightboxItem.
 */
export function ComponentRenderer({ item }: ComponentRendererProps) {
  if (!item.component) return null;

  const Component = item.component;
  return <Component {...(item.data || {})} />;
}
