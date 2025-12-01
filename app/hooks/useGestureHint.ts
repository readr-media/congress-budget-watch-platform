import { useCallback, useEffect, useRef, useState } from "react";

type UseGestureHintOptions = {
  autoHideMs: number;
};

export const useGestureHint = ({ autoHideMs }: UseGestureHintOptions) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHintTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismissHint = useCallback(() => {
    clearHintTimeout();
    setVisible(false);
  }, [clearHintTimeout]);

  const showHint = useCallback(() => {
    setVisible(true);
    clearHintTimeout();
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = null;
    }, autoHideMs);
  }, [autoHideMs, clearHintTimeout]);

  useEffect(() => dismissHint, [dismissHint]);

  return {
    visible,
    showHint,
    dismissHint,
  };
};


