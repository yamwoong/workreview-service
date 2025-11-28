import {
  forwardRef,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type ReactNode
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      type = 'text',
      className = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputType = useMemo(() => {
      if (type !== 'password') {
        return type;
      }

      return isPasswordVisible ? 'text' : 'password';
    }, [type, isPasswordVisible]);

    const hasLeftIcon = Boolean(icon);
    const hasRightIcon = type === 'password';
    const hasIcon = hasLeftIcon || hasRightIcon;

    const borderColor = error ? 'border-red-500' : 'border-gray-300';
    const focusRingColor = error ? 'focus:ring-red-500' : 'focus:ring-blue-500';
    const inputId = rest.id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const toggleVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const baseInputStyles = [
      'w-full',
      'px-4',
      'py-3',
      'border',
      'rounded-lg',
      'text-gray-900',
      'placeholder:text-gray-400',
      'focus:outline-none',
      'focus:ring-2',
      'focus:border-transparent',
      'transition-all',
      borderColor,
      focusRingColor,
      disabled ? 'bg-gray-50 cursor-not-allowed' : '',
      hasLeftIcon ? 'pl-10' : '',
      hasRightIcon ? 'pr-10' : '',
      className
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 mb-1.5 block"
          >
            {label}
            {rest.required ? <span className="text-red-500 ml-1">*</span> : null}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
            className={baseInputStyles}
            {...rest}
          />

          {type === 'password' && (
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              tabIndex={-1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                {!isPasswordVisible && <path d="M2 2l20 20" />}
              </svg>
            </button>
          )}
        </div>

        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-500 mt-1.5">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-red-500 mt-1.5" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

