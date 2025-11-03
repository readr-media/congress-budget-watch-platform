import type { ImgHTMLAttributes } from "react";
import { STATIC_ASSETS_PREFIX } from "~/constants/config";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const Image = ({ src, ...props }: ImageProps) => {
  return <img src={STATIC_ASSETS_PREFIX + src} {...props} />;
};

export default Image;
