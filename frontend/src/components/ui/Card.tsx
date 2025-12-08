import { forwardRef, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const PADDING_MAP: Record<CardProps['padding'], string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', padding = 'md', hover = false }, ref) => {
    const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-150' : '';

    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-md ${PADDING_MAP[padding]} ${hoverStyles} ${className}`}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';











