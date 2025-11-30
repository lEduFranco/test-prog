import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-600 text-sm font-medium animate-pulse">Carregando...</p>
    </div>
  );
};
