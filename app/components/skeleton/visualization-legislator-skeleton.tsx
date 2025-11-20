type VisualizationLegislatorSkeletonProps = {
  isDesktop: boolean;
};

const DesktopSkeleton = () => (
  <div className="animate-pulse">
    <div className="md:max-w-visualization-body flex flex-col items-center gap-y-6 px-3 md:mx-auto">
      <div className="h-4 w-24 self-start rounded bg-gray-200" />
      <div className="flex flex-col items-center gap-y-2">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="h-5 w-28 rounded bg-gray-200" />
        <div className="h-5 w-40 rounded bg-gray-200" />
      </div>
      <div className="flex gap-x-4">
        <div className="h-9 w-24 rounded bg-gray-200" />
        <div className="h-9 w-24 rounded bg-gray-200" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-44 rounded bg-gray-200" />
        <div className="h-5 w-56 rounded bg-gray-200" />
      </div>
      <div className="w-full rounded-lg border-2 border-dashed border-gray-200 p-4">
        <div className="flex flex-col items-center gap-y-2">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="h-4 w-52 rounded bg-gray-200" />
        </div>
      </div>
      <div className="h-10 w-full rounded bg-gray-200" />
      <div className="flex w-full flex-col gap-y-6">
        {[0, 1].map((key) => (
          <div
            key={key}
            className="flex flex-col gap-y-3 rounded-lg border border-dashed border-gray-200 p-4"
          >
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-72 w-full rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MobileSkeleton = () => (
  <div className="animate-pulse px-3">
    <div className="flex flex-col items-center gap-y-5">
      <div className="h-4 w-20 self-start rounded bg-gray-200" />
      <div className="flex flex-col items-center gap-y-2">
        <div className="h-5 w-28 rounded bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-36 rounded bg-gray-200" />
      </div>
      <div className="flex w-full flex-col gap-y-3">
        <div className="h-9 w-full rounded bg-gray-200" />
        <div className="h-9 w-full rounded bg-gray-200" />
      </div>
      <div className="flex flex-col items-center gap-y-3">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="h-4 w-44 rounded bg-gray-200" />
      </div>
      <div className="w-full rounded-lg border-2 border-dashed border-gray-200 p-4">
        <div className="flex flex-col items-center gap-y-2">
          <div className="h-4 w-36 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>
      <div className="h-10 w-full rounded bg-gray-200" />
      <div className="flex w-full flex-col gap-y-5">
        {[0, 1].map((key) => (
          <div
            key={key}
            className="flex flex-col gap-y-2 rounded-lg border border-dashed border-gray-200 p-4"
          >
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-64 w-full rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VisualizationLegislatorSkeleton = ({
  isDesktop,
}: VisualizationLegislatorSkeletonProps) => {
  return isDesktop ? <DesktopSkeleton /> : <MobileSkeleton />;
};

export default VisualizationLegislatorSkeleton;
