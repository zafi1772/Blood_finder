import React from 'react';
import classNames from 'classnames';

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary:
        'text-white bg-red-600 hover:bg-red-700 border-transparent focus:ring-red-500',
      outline:
        'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-3 text-base rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={classNames(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
