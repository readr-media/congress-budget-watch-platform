import type { ImgHTMLAttributes } from "react";
import { STATIC_ASSETS_PREFIX } from "~/constants/config";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const ABSOLUTE_URL_PATTERN = /^([a-z][a-z\d+\-.]*:)?\/\//i;

const Image = ({ src, ...props }: ImageProps) => {
  const isAbsolute = ABSOLUTE_URL_PATTERN.test(src);
  const normalizedSrc = isAbsolute
    ? src
    : `${STATIC_ASSETS_PREFIX}${src.startsWith("/") ? src.slice(1) : src}`;

  return <img src={normalizedSrc} {...props} />;
};

export default Image;
