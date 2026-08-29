import React, { useState, useEffect, useRef } from 'react';

const imageCache = new Set();

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholderClassName = '',
    onLoad,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imageCache.has(src)) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '50px', threshold: 0.01 }
        );

        if (imgRef.current) observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
        imageCache.add(src);
        if (onLoad) onLoad();
    };

    return (
        <div ref={imgRef} className="absolute inset-0 overflow-hidden">
            {!isLoaded && (
                <div className={`absolute inset-0 animate-pulse bg-[#EAD2C0]/25 ${placeholderClassName}`} />
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    onLoad={handleLoad}
                    loading="lazy"
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyImage;
