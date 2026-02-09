/**
 * Alert Component - Displays error/success messages
 * Features: Customizable type (error/success), dismissible, auto-close support
 */

import React from 'react';
import { X } from 'lucide-react';

export default function Alert({ 
  type = 'error', // 'error' or 'success'
  message, 
  onClose,
  dismissible = true,
  autoClose = false,
  autoCloseDuration = 5000
}) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (!autoClose || !isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDuration, isVisible, onClose]);

  if (!isVisible || !message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`mt-4 rounded-xl border p-3 text-sm flex items-center justify-between ${
        isSuccess
          ? 'border-emerald-700 bg-emerald-900/30 text-emerald-200'
          : 'border-rose-700 bg-rose-900/30 text-rose-200'
      }`}
    >
      <span>{message}</span>
      {dismissible && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 hover:opacity-70 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
