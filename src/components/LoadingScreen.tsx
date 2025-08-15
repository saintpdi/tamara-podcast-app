import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <div className="relative">
          {/* Animated logo/spinner */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin"></div>
          </div>
          
          {/* App name */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            SheTalks
          </h1>
          
          {/* Loading text */}
          <p className="text-gray-600 animate-pulse">
            Loading your experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
