import { CirclePackControls } from "./components/CirclePackControls";
import { CirclePackCanvas } from "./components/CirclePackCanvas";
import { GESTURE_HINT_MESSAGE } from "./circle-pack-config";
import type { CirclePackChartProps } from "./circle-pack-types";
import { useCirclePackChart } from "./useCirclePackChart";

export type { CirclePackPadding } from "./circle-pack-types";

const CirclePackChart = (props: CirclePackChartProps) => {
  const {
    containerRef,
    gestureHintVisible,
    dismissGestureHint,
    commands,
  } = useCirclePackChart(props);

  return (
    <div className="relative flex w-full items-center justify-center">
      <CirclePackCanvas containerRef={containerRef} />
      <CirclePackControls
        gestureHintVisible={gestureHintVisible}
        gestureHintMessage={GESTURE_HINT_MESSAGE}
        onDismissGestureHint={dismissGestureHint}
        onZoomIn={commands.zoomIn}
        onZoomOut={commands.zoomOut}
      />
    </div>
  );
};

export default CirclePackChart;
