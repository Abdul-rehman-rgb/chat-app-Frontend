/**
 * AuthButton Component - Reusable button for authentication forms
 * Features: Loading state indicator, disabled state, customizable text
 */

import React from 'react';

export default function AuthButton({
  loading = false,
  children,
  loadingText = 'Loading...',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  variant = 'primary', // 'primary', 'danger', 'secondary'
  ...props
}) {
  const baseClasses = 'w-full rounded-xl py-2.5 font-medium transition';
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60',
    danger: 'bg-red-600 hover:bg-red-700 disabled:opacity-60',
    secondary: 'bg-slate-700 hover:bg-slate-600 disabled:opacity-60',
  };

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
