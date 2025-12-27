import React, { useState, useEffect, useRef } from 'react';

// Create a simple in-memory cache for loaded images
const imageCache = new Set();

const LazyImage = ({ 
    src, 
    alt, 
    className = '', 
    placeholderClassName = '',
    onLoad,
    ...props 
}) => {
    // Check if image is already cached
    const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        // If image is already cached, no need to wait for IntersectionObserver
        if (imageCache.has(src)) {
            setIsInView(true);
            return;
        }

        // Use Intersection Observer to detect when image enters viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
        // Add to cache so it won't be fetched again
        imageCache.add(src);
        if (onLoad) {
            onLoad();
        }
    };

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Placeholder - shown while loading */}
            {!isLoaded && (
                <div className={`absolute inset-0 bg-gradient-to-br from-[#EAD2C0]/20 to-[#D8A24A]/20 animate-pulse ${placeholderClassName}`} />
            )}
            
            {/* Actual image - only load when in viewport */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleLoad}
                    loading="lazy"
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyImage;
