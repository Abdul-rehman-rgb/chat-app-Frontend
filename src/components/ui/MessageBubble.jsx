/**
 * MessageBubble Component - Display chat messages (sent/received)
 * Features: Different styling for sent/received, timestamps, avatar support
 */

import React from 'react';
import UserAvatar from './UserAvatar';

export default function MessageBubble({
  content,
  timestamp,
  isSent = false,
  sender = null, // For received messages: { name, avatar, status }
  status = 'delivered', // 'delivered', 'read', 'sending' for sent messages
  className = '',
}) {
  return (
    <div
      className={`flex gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] ${
        isSent ? 'ml-auto' : 'mr-auto'
      } ${className}`}
    >
      {!isSent && sender && (
        <UserAvatar
          name={sender.name}
          status={sender.status}
          src={sender.avatar}
          size="sm"
          className="mt-1"
        />
      )}

      <div>
        {!isSent && sender && (
          <p className="text-[11px] text-slate-400 mb-0.5 ml-1">{sender.name}</p>
        )}
        <div
          className={`p-3 rounded-2xl text-sm break-words ${
            isSent
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-gray-700 text-gray-100 rounded-tl-none'
          }`}
        >
          {content}
        </div>

        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
          <span className={isSent ? 'float-right mr-1' : 'float-left ml-1'}>
            {timestamp}
          </span>
          {isSent && status && (
            <span className="text-[9px]">
              {status === 'sending' && '⏳'}
              {status === 'delivered' && '✓'}
              {status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
