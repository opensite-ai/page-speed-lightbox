import { useEffect } from "react";

export function useKeyboardShortcuts(
  shortcuts: Record<string, (e?: KeyboardEvent) => void>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = shortcuts[e.key];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}
