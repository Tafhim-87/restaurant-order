'use client';

import React from 'react';

interface ApiStatusIndicatorProps {
  loading: boolean;
  error: string | null;
  success: boolean;
  loadingText?: string;
  errorText?: string;
  successText?: string;
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  loading,
  error,
  success,
  loadingText = 'Loading...',
  errorText = 'Error',
  successText = 'Success'
}) => {
  if (loading) {
    return (
      <div className="flex items-center text-blue-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
        <span>{loadingText}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        {errorText}: {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-green-500 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {successText}
      </div>
    );
  }

  return null;
};