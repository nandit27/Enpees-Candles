import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
    src, 
    alt, 
    className = '', 
    placeholderClassName = '',
    onLoad,
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
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
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
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
