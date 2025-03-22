import React, { useEffect } from "react";
import picture1 from "../assets/logo/Picture1.png";

const LoadingScreen = () => {
  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling after loading
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-gray-700 z-50">
      {/* Full-Screen Overlay */}
      <div className="absolute inset-0 bg-blue-gray-700"></div>

      {/* Animated Circular Background */}
      <div className="relative flex items-center justify-center z-10">
        <div className="absolute w-32 h-32 border-4 border-amber-700 rounded-full animate-ping"></div>
        <div className="absolute w-40 h-40 border-4 border-amber-700 rounded-full animate-ping-slow"></div>
        {/* Static Logo (No Rotation) */}
        <img
          src={picture1}
          alt="DineMate Logo"
          className="w-40 h-40 relative" // ✅ Removed animate-spin-slow
        />
      </div>

      {/* Loading Text with Animated Dots */}
      <p className="pt-5 mt-10 text-xl font-semibold text-white animate-pulse z-10">
        Your Ultimate Restaurant Companion
        <span className="dot-animate">....</span>
      </p>
    </div>
  );
};

export default LoadingScreen;
