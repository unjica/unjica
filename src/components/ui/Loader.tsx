import React from 'react';
import { cn } from '@/lib/utils';

type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LoaderVariant = 'default' | 'primary' | 'secondary' | 'ghost';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const variantClasses: Record<LoaderVariant, string> = {
  default: 'border-gray-300 border-t-gray-800 dark:border-gray-700 dark:border-t-gray-300',
  primary: 'border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400',
  secondary: 'border-purple-200 border-t-purple-600 dark:border-purple-900 dark:border-t-purple-400',
  ghost: 'border-gray-200 border-t-gray-500 dark:border-gray-800 dark:border-t-gray-400',
};

export function Loader({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className,
}: LoaderProps) {
  const loaderContent = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className={cn(
          'mt-3 text-sm font-medium text-gray-600 dark:text-gray-400',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}

export function LoaderDots({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className,
}: LoaderProps) {
  const dotSizes: Record<LoaderSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const dotColors: Record<LoaderVariant, string> = {
    default: 'bg-gray-600 dark:bg-gray-400',
    primary: 'bg-blue-600 dark:bg-blue-400',
    secondary: 'bg-purple-600 dark:bg-purple-400',
    ghost: 'bg-gray-500 dark:bg-gray-400',
  };

  const dotsContent = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="flex space-x-2">
        <div className={cn(
          'rounded-full animate-bounce',
          dotSizes[size],
          dotColors[variant],
          'animation-delay-0'
        )} />
        <div className={cn(
          'rounded-full animate-bounce',
          dotSizes[size],
          dotColors[variant],
          'animation-delay-150'
        )} />
        <div className={cn(
          'rounded-full animate-bounce',
          dotSizes[size],
          dotColors[variant],
          'animation-delay-300'
        )} />
      </div>
      {text && (
        <p className={cn(
          'mt-3 text-sm font-medium text-gray-600 dark:text-gray-400',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {dotsContent}
      </div>
    );
  }

  return dotsContent;
}

export function LoaderPulse({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className,
}: LoaderProps) {
  const pulseSizes: Record<LoaderSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const pulseColors: Record<LoaderVariant, string> = {
    default: 'bg-gray-400/30 dark:bg-gray-600/30',
    primary: 'bg-blue-400/30 dark:bg-blue-600/30',
    secondary: 'bg-purple-400/30 dark:bg-purple-600/30',
    ghost: 'bg-gray-300/30 dark:bg-gray-700/30',
  };

  const pulseContent = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative">
        <div className={cn(
          'rounded-full animate-pulse',
          pulseSizes[size],
          pulseColors[variant]
        )}>
          <div className={cn(
            'absolute inset-0 rounded-full border-2 border-dashed',
            size === 'lg' || size === 'xl' ? 'border-4' : 'border-2',
            variant === 'default' ? 'border-gray-500 dark:border-gray-400' :
            variant === 'primary' ? 'border-blue-500 dark:border-blue-400' :
            variant === 'secondary' ? 'border-purple-500 dark:border-purple-400' :
            'border-gray-400 dark:border-gray-500',
            'animate-spin'
          )} />
        </div>
      </div>
      {text && (
        <p className={cn(
          'mt-3 text-sm font-medium text-gray-600 dark:text-gray-400',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {pulseContent}
      </div>
    );
  }

  return pulseContent;
}

// Add this to your global CSS or create a utility class
// .animation-delay-0 { animation-delay: 0ms; }
// .animation-delay-150 { animation-delay: 150ms; }
// .animation-delay-300 { animation-delay: 300ms; }
