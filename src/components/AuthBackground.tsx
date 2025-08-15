
import React from 'react';

const AuthBackground = () => {
  return (
    <>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.7)' }}
      >
        <source src="https://cdn.pixabay.com/video/2022/07/10/123739-728686326_large.mp4" type="video/mp4" />
        {/* Fallback to original background image if video fails to load */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/lovable-uploads/cb5aad11-0e3a-4adb-a873-6982ba00c5c9.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </video>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10"></div>

      {/* Accessibility: Respect reduced motion preferences */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          video {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </>
  );
};

export default AuthBackground;
