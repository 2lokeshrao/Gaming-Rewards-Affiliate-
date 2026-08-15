import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden shrink-0 bg-slate-800 ${className.replace(/object-cover|shrink-0|bg-slate-800/g, '').trim()}`}>
      {/* Low quality placeholder or blur background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse border border-slate-700/50 rounded-[inherit]" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 rounded-[inherit] ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
        } ${className.includes('border') ? 'border border-slate-700' : ''}`}
        {...props}
      />
    </div>
  );
};
