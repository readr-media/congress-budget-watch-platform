import type { MutableRefObject } from "react";

type CirclePackCanvasProps = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  className?: string;
};

export const CirclePackCanvas = ({
  containerRef,
  className = "",
}: CirclePackCanvasProps) => {
  return <div ref={containerRef} className={className} />;
};


