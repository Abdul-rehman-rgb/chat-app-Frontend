/**
 * FormSelect Component - Reusable select input with label
 * Features: Multiple options, validation feedback, optional label
 */

import React from 'react';

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = null,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-slate-300 mb-1">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl bg-slate-950/60 border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition ${
          error
            ? 'border-rose-700 focus:ring-rose-500'
            : 'border-slate-800 focus:ring-indigo-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
