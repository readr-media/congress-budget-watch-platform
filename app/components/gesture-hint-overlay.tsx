import { useEffect, useRef, useState } from "react";

const EXIT_ANIMATION_MS = 200;

type GestureHintOverlayProps = {
  visible: boolean;
  message: string;
  /**
   * Automatically invoke `onDismiss` after the provided duration (ms).
   * Pass `0` or omit to disable auto-dismiss.
   */
  autoHideMillis?: number;
  onDismiss?: () => void;
  className?: string;
};

export function GestureHintOverlay({
  visible,
  message,
  autoHideMillis = 0,
  onDismiss,
  className = "",
}: GestureHintOverlayProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the component mounted long enough for fade-out animations.
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
      return;
    }

    exitTimeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      exitTimeoutRef.current = null;
    }, EXIT_ANIMATION_MS);

    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [visible]);

  // Optional internal auto-dismiss timer.
  useEffect(() => {
    if (!visible || autoHideMillis <= 0) {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
      }
      return;
    }

    autoHideTimeoutRef.current = setTimeout(() => {
      autoHideTimeoutRef.current = null;
      onDismiss?.();
    }, autoHideMillis);

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
      }
    };
  }, [visible, autoHideMillis, onDismiss]);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={visible ? undefined : true}
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <div className="rounded-lg bg-white/90 px-6 py-4 shadow-lg backdrop-blur-sm">
        <p className="select-none text-lg font-medium text-gray-900">
          {message}
        </p>
      </div>
    </div>
  );
}
