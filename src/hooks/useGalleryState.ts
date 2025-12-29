import { useState, useCallback } from "react";
import { LightboxItem } from "../types";

export function useGalleryState({
  items,
  initialIndex = 0,
  onSelect,
}: {
  items: LightboxItem[];
  initialIndex?: number;
  onSelect?: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, items.length - 1))
  );

  const currentItem = items[currentIndex] ?? null;

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) return;
      setCurrentIndex(index);
      onSelect?.(index);
    },
    [items.length, onSelect]
  );

  const next = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const prev = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  return {
    currentIndex,
    currentItem,
    goToIndex,
    next,
    prev,
    canNext: currentIndex < items.length - 1,
    canPrev: currentIndex > 0,
  };
}
