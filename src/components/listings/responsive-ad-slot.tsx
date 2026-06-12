import { AdSlot, buildRotationSeed } from "@/ads";
import type { AdSize } from "@/ads/types";

type Props = {
  slotId: string;
  pagePath: string;
  desktopSize?: AdSize;
  mobileSize?: AdSize;
  className?: string;
};

export function ResponsiveAdSlot({
  slotId,
  pagePath,
  desktopSize = "728x90",
  mobileSize = "320x50",
  className = "",
}: Props) {
  return (
    <>
      <AdSlot
        slotId={`${slotId}-mobile`}
        size={mobileSize}
        seed={buildRotationSeed(pagePath, `${slotId}-mobile`)}
        className={`${className} max-w-full md:hidden`.trim()}
      />
      <AdSlot
        slotId={`${slotId}-desktop`}
        size={desktopSize}
        seed={buildRotationSeed(pagePath, `${slotId}-desktop`)}
        className={`${className} hidden max-w-full md:block`.trim()}
      />
    </>
  );
}
