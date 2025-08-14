import React from 'react';
import classNames from 'classnames';

export function Skeleton({ className = '' }) {
  return (
    <div className={classNames('animate-pulse bg-gray-200 rounded-md', className)} />
  );
}

export default Skeleton;
