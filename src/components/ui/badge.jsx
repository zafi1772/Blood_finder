import React from 'react';
import classNames from 'classnames';

export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium';
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-200 text-gray-900',
  };
  return (
    <span className={classNames(base, variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
