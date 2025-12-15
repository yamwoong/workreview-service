import { forwardRef } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP: Record<SpinnerProps['size'], string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', className = '' }, ref) => (
    <span
      ref={ref}
      className={`inline-block rounded-full border-2 border-gray-200 border-t-primary-600 animate-spin ${SIZE_MAP[size]} ${className}`}
      role="status"
      aria-live="polite"
    />
  )
);

Spinner.displayName = 'Spinner';















