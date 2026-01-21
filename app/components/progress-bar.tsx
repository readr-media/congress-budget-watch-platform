type ProgressBarProps = {
  isDesktop?: boolean;
  isFinished?: boolean;
  count?: number;
  width?: number;
  height?: number;
  gap?: number;
  className?: string;
  labels?: string[];
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  isFinished = true,
  count,
  width = 165,
  height = 48,
  gap = 16,
  className = "",
  labels = [],
  isDesktop = false,
}) => {
  const effectiveCount =
    typeof count === "number"
      ? count
      : labels && labels.length > 0
        ? labels.length
        : 6;
  const progressBoxType = isFinished
    ? `${import.meta.env.BASE_URL}image/progress-box.svg`
    : `${import.meta.env.BASE_URL}image/not-finished-progress-box.svg`;

  const baseZIndex = 90;

  const totalHeight = height + (height - gap) * (effectiveCount - 1);
  if (isDesktop)
    return (
      <div className="text-sm">
        <section className="text-brand-primary mb-2 flex w-full items-center justify-center gap-x-2 text-lg font-bold">
          <p className="relative">
            <span className="md:text-sm lg:text-xl">最新進度</span>
            <img
              src={`${import.meta.env.BASE_URL}image/magnifier-eye.svg`}
              alt="magnifier eye logo"
              className="absolute z-10 md:-top-7 md:-left-7 md:h-[48px] md:w-auto lg:-top-10 lg:-left-12 lg:h-[63px] lg:w-[55px]"
            />
          </p>
          <div className="relative flex items-center">
            {labels.map((label, index) => (
              <div
                className={`relative rounded-lg border-2 pr-3 md:text-xs ${
                  isFinished
                    ? "bg-brand-primary border-white text-white"
                    : "border-brand-primary text-brand-primary bg-white"
                } ${index > 0 ? "-ml-3 pl-5" : "pl-3"}`}
                key={label}
                style={{ zIndex: labels.length - index }}
              >
                {label}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  return (
    <section
      className={`relative ${className}`}
      style={{ height: totalHeight }}
    >
      <img
        src={`${import.meta.env.BASE_URL}image/eye.svg`}
        alt="eye icon"
        className="absolute -top-[14px] -right-[38px] z-99"
      />
      {Array.from({ length: effectiveCount }, (_, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: index * (height - gap),
            zIndex: baseZIndex - index * 10,
          }}
        >
          <img
            src={progressBoxType}
            height={height}
            width={width}
            alt={`progress box ${index + 1}`}
          />
          {labels[index] && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                marginTop: index > 0 ? 7 : 0,
              }}
            >
              <span className="px-2 text-center text-sm font-bold text-white">
                {labels[index]}
              </span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default ProgressBar;
