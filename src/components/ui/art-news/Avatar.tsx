interface AvatarProps {
  src?: string;
  fallback: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
}

export function Avatar({ src, fallback, size }: AvatarProps) {
  const sizeClass = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];

  return src ? (
    <img src={src} alt="User avatar" className={`${sizeClass} rounded-full object-cover`} />
  ) : (
    <div className={`${sizeClass} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300`}>
      {fallback}
    </div>
  );
} 