import { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

type ImageProps = {
  src: string;
  fallbackSrc: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({
  src,
  fallbackSrc,

  // skeleton,
  className,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<null | HTMLImageElement>(null);

  return (
    <>
      {isLoading && (
        <Skeleton
          className={`dark:bg-slate-500 ${className ? className : ''}`}
        />
      )}
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

      {hasError && (
        <img
          src={fallbackSrc}
          className={`${isLoading || !hasError ? 'hidden ' : ''}${
            className ? className : ''
          }`}
          onLoad={(event) => {
            setIsLoading(false);
            props.onLoad && props.onLoad(event);
          }}
          {...props}
        />
      )}
    </>
  );
};

export default Image;
