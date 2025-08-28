import React, { useState, useEffect, useRef, useCallback } from 'react';

interface OptimizedSplineViewerProps {
  url: string;
  style?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
  className?: string;
  enableLazyLoading?: boolean;
  enableIntersectionObserver?: boolean;
  quality?: 'low' | 'medium' | 'high';
}

export function OptimizedSplineViewer({
  url,
  style,
  fallbackContent,
  className = '',
  enableLazyLoading = true,
  enableIntersectionObserver = true,
  quality = 'medium'
}: OptimizedSplineViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!enableLazyLoading);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

  // Intersection Observer for performance optimization
  useEffect(() => {
    if (!enableIntersectionObserver || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          
          // Pause/resume rendering based on visibility
          if (splineRef.current) {
            if (entry.isIntersecting) {
              splineRef.current.play?.();
            } else {
              splineRef.current.pause?.();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enableIntersectionObserver, isLoaded]);

  // Lazy loading trigger
  useEffect(() => {
    if (!enableLazyLoading || !containerRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enableLazyLoading]);

  // Load Spline script
  useEffect(() => {
    if (!isVisible) return;

    let cleanup = false;

    const loadSplineViewer = async () => {
      try {
        // Check if already loaded
        if (window.customElements && window.customElements.get('spline-viewer')) {
          setIsLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js';
        
        script.onload = () => {
          if (!cleanup) {
            setIsLoaded(true);
          }
        };
        
        script.onerror = () => {
          if (!cleanup) {
            console.warn('Failed to load Spline viewer');
            setHasError(true);
          }
        };
        
        document.body.appendChild(script);
      } catch (error) {
        if (!cleanup) {
          console.warn('Error loading Spline viewer:', error);
          setHasError(true);
        }
      }
    };

    loadSplineViewer();

    return () => {
      cleanup = true;
    };
  }, [isVisible]);

  const handleSplineRef = useCallback((element: any) => {
    splineRef.current = element;
    
    if (element) {
      // Set quality settings
      const qualitySettings = {
        low: { pixelRatio: 0.5, antialias: false },
        medium: { pixelRatio: 0.75, antialias: true },
        high: { pixelRatio: 1, antialias: true }
      };
      
      const settings = qualitySettings[quality];
      
      // Apply performance settings
      element.addEventListener('load', () => {
        try {
          if (element.spline?.renderer) {
            element.spline.renderer.setPixelRatio(settings.pixelRatio);
          }
        } catch (error) {
          console.warn('Could not apply quality settings:', error);
        }
      });
    }
  }, [quality]);

  const defaultFallback = (
    <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
      <div className="text-white text-center">
        <h3 className="text-2xl font-bold mb-2">GlyceraCare</h3>
        <p className="mb-4">Natural Handcrafted Soaps</p>
      </div>
    </div>
  );

  if (hasError || !isVisible) {
    return (
      <div ref={containerRef} className={className} style={style}>
        {fallbackContent || defaultFallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {isLoaded ? (
        <>
          <spline-viewer
            ref={handleSplineRef}
            url={url}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              ...style,
            }}
            loading="lazy"
            data-quality={quality}
            onError={() => {
              console.warn('Spline viewer error');
              setHasError(true);
            }}
          ></spline-viewer>
          {!isIntersecting && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-md">
                3D rendering paused
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading 3D experience...</p>
          </div>
        </div>
      )}
    </div>
  );
}