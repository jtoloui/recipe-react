import { ReactNode, useRef, useState } from 'react';

import { LogoLoader } from '../LogoLoader';

type ImageProps = {
  src?: string;
  fallbackSrc?: string;
  /**
   * Rendered when the image fails to load (and no working fallbackSrc).
   * Use this for a branded placeholder instead of a broken <img> / grey void.
   * Defaults to the animated Nest Steam LogoLoader.
   */
  placeholder?: ReactNode;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({
  src,
  fallbackSrc,
  placeholder,
  className,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const imageRef = useRef<null | HTMLImageElement>(null);

  const resolvedPlaceholder = placeholder ?? <LogoLoader className={className} />;

  // Nothing usable to show → render the branded placeholder.
  const showPlaceholder =
    (hasError && (!fallbackSrc || fallbackFailed)) || !src;

  if (showPlaceholder) {
    return <>{resolvedPlaceholder}</>;
  }

  return (
    <>
      {isLoading && !hasError && <LogoLoader className={className} />}
      {src && (
        <img
          ref={imageRef}
          src={src}
          onLoad={(event) => {
            setIsLoading(false);
            props.onLoad && props.onLoad(event);
          }}
          className={`${isLoading || hasError ? 'hidden ' : ''}${
            className ? className : ''
          }`}
          onError={(event) => {
            setHasError(true);
            props.onError && props.onError(event);
          }}
          {...props}
        />
      )}

      {hasError && fallbackSrc && !fallbackFailed && (
        <img
          src={fallbackSrc}
          className={className ? className : ''}
          onLoad={(event) => {
            setIsLoading(false);
            props.onLoad && props.onLoad(event);
          }}
          onError={() => setFallbackFailed(true)}
          {...props}
        />
      )}
    </>
  );
};

export default Image;
