import { useEffect, useRef, useState } from 'react';
import { normalizePublicAssetUrl } from '../../data/assets.ts';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  rootMargin?: string;
  fallbackTitle?: string;
}

export function EditorialImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  priority = false,
  rootMargin = '300px 0px',
  fallbackTitle,
}: EditorialImageProps) {
  const resolvedSrc = normalizePublicAssetUrl(src);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => priority || typeof IntersectionObserver === 'undefined',
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    if (priority) {
      setShouldLoad(true);
    }
  }, [resolvedSrc, priority]);

  useEffect(() => {
    if (priority || shouldLoad) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, shouldLoad, rootMargin]);

  useEffect(() => {
    if (!shouldLoad) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [shouldLoad, resolvedSrc]);

  if (hasError || !resolvedSrc) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#23201D] text-[#F5F1EA] overflow-hidden ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 25%, rgba(182,164,141,0.35), transparent 60%)',
          }}
        />
        <span className="font-serif text-sm sm:text-base tracking-[0.14em] uppercase text-[#B6A48D] relative z-10 px-4 text-center">
          House of Fashion Nepal
        </span>
        {fallbackTitle && (
          <span className="mt-2 text-xs tracking-wider text-[#F5F1EA]/70 relative z-10 px-4 text-center">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  const hasIntrinsicContainerHeight =
    containerClassName.includes('aspect-') ||
    containerClassName.includes('h-full') ||
    /\bh-\d|\bh-\[/.test(containerClassName);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#1D1B18] ${
        !isLoaded && !hasIntrinsicContainerHeight ? 'min-h-[240px]' : ''
      } ${containerClassName}`}
    >
      {!isLoaded && (
        <div
          role={!shouldLoad ? 'img' : undefined}
          aria-label={!shouldLoad ? alt : undefined}
          aria-hidden={shouldLoad ? true : undefined}
          className="absolute inset-0 bg-[#23201D] animate-pulse motion-reduce:animate-none"
          style={{
            backgroundImage:
              'linear-gradient(120deg, rgba(255,255,255,0) 20%, rgba(182,164,141,0.08) 50%, rgba(255,255,255,0) 80%)',
          }}
        />
      )}

      {shouldLoad && (
        <div
          className={`w-full h-full transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            ref={imgRef}
            src={resolvedSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={className}
          />
        </div>
      )}
    </div>
  );
}
