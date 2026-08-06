import React, { useState } from 'react';

interface BookCoverImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  showSpine?: boolean;
}

export const BookCoverImage: React.FC<BookCoverImageProps> = ({
  src,
  alt,
  width = 160,
  height = 224,
  className = '',
  containerClassName = '',
  onClick,
  showSpine = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#EFECE6] shrink-0 aspect-[2/3] ${containerClassName}`}
    >
      {/* Skeleton Pulse loader while image is loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#E2DDD3] via-[#EFECE6] to-[#E2DDD3] animate-pulse rounded-r-lg rounded-l-sm" />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />

      {showSpine && <div className="absolute inset-y-0 left-0 w-2 book-spine-effect pointer-events-none z-10" />}
    </div>
  );
};
