import { useState, useRef, type RefCallback, useCallback } from "react";

const useChartDimensions = () => {
  const defaultWidth = 300;
  const defaultAspectRatio = 3 / 4;
  const defaultHeight = Math.round(defaultWidth * defaultAspectRatio);

  const [height, setHeight] = useState<number>(defaultHeight);
  const [width, setWidth] = useState(defaultWidth);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref: RefCallback<HTMLDivElement> = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) return;

    const measure = () => {
      const newWidth = node.getBoundingClientRect().width;
      if (newWidth <= 0) return;

      setWidth(newWidth);
      setHeight(Math.round(newWidth * defaultAspectRatio));
    };

    const animationFrameId = requestAnimationFrame(measure);

    observerRef.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      setWidth(width);
      setHeight(Math.round(width * defaultAspectRatio));
    });

    observerRef.current.observe(node);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { ref, width, height };
};

export default useChartDimensions;
