/**
 * UserAvatar Component - Display user avatar with online/offline status indicator
 * Features: Customizable size, status badge, initial fallback, image support
 */

import React from 'react';

export default function UserAvatar({
  name = 'User',
  status = 'offline', // 'online' or 'offline'
  src = null,
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  showStatus = true,
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const statusDotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const statusColor = status === 'online' ? 'bg-green-500' : 'bg-gray-400';

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm`}>
          {initials}
        </div>
      )}

      {showStatus && (
        <div
          className={`absolute bottom-0 right-0 ${statusDotSizes[size]} rounded-full border-2 border-gray-800 ${statusColor}`}
        />
      )}
    </div>
  );
}
