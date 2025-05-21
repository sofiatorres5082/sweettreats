import { useState } from "react";

export function ImageWithSkeleton({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          className="
            absolute inset-0
            bg-gray-400
            rounded-2xl
            animate-pulse
          "
        />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`
          object-cover rounded-2xl w-full h-full
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

