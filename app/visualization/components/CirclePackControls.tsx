import { GestureHintOverlay } from "../../components/gesture-hint-overlay";

type CirclePackControlsProps = {
  gestureHintVisible: boolean;
  gestureHintMessage: string;
  onDismissGestureHint: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export const CirclePackControls = ({
  gestureHintVisible,
  gestureHintMessage,
  onDismissGestureHint,
  onZoomIn,
  onZoomOut,
}: CirclePackControlsProps) => {
  return (
    <>
      <GestureHintOverlay
        visible={gestureHintVisible}
        message={gestureHintMessage}
        onDismiss={onDismissGestureHint}
      />
      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <button
          onClick={onZoomIn}
          className="focus:ring-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 focus:ring-2 focus:outline-none"
          aria-label="Zoom In"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={onZoomOut}
          className="focus:ring-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 focus:ring-2 focus:outline-none"
          aria-label="Zoom Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </>
  );
};


