"use client";

import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface OptimizedIconProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
}

const OptimizedIcon = memo(function OptimizedIcon({
  src,
  alt = "",
  size = 32,
  className,
  fallback = "🔗",
  priority = false
}: OptimizedIconProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !src) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { 
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  // 如果没有图标源或出错，显示默认图标
  if (!src || error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 rounded-lg text-gray-400",
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ width: size, height: size }}
    >
      {/* Loading placeholder */}
      {!loaded && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg"
          style={{ width: size, height: size }}
        />
      )}
      
      {/* Actual image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ 
            width: size, 
            height: size,
            contentVisibility: 'auto'
          }}
        />
      )}
    </div>
  );
});

export default OptimizedIcon;