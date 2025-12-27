import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const PADDING_MAP: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', padding = 'md', hover = false, ...rest }, ref) => {
    const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-150' : '';

    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-md ${PADDING_MAP[padding]} ${hoverStyles} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';






















