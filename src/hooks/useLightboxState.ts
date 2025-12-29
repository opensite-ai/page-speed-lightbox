import { useState, useCallback, useEffect } from "react";

export function useLightboxState({
  onOpen,
  onClose,
  disableScroll = true,
}: {
  onOpen?: () => void;
  onClose?: () => void;
  disableScroll?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    }
  }, [onOpen, disableScroll]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    if (disableScroll) {
      document.body.style.overflow = "";
    }
  }, [onClose, disableScroll]);

  useEffect(() => {
    return () => {
      if (disableScroll) {
        document.body.style.overflow = "";
      }
    };
  }, [disableScroll]);

  return { isOpen, open, close };
}
