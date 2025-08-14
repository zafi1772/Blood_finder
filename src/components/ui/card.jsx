import React from 'react';
import classNames from 'classnames';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={classNames('bg-white rounded-lg border border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={classNames('px-6 py-4 border-b border-gray-100', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h2 className={classNames('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={classNames('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}
