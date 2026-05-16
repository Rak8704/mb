import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="h-[46px] w-[46px] animate-spin rounded-full border-4 border-muted border-t-foreground" />
    </div>
  );
};

export default LoadingScreen;