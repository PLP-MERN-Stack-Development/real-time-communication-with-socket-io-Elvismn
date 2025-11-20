import React from 'react';
import { useSocketContext } from '../../context/SocketContext';

const TypingIndicator = () => {
  const { typingUsers } = useSocketContext();

  if (typingUsers.length === 0) return null;

  return (
    <div className="px-6 py-3 bg-gradient-to-r from-blue-50/50 to-purple-50/30 border-b border-gray-100/60">
      <div className="flex items-center space-x-3 text-sm">
        {/* Animated typing dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce-soft"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce-soft" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce-soft" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Typing text with gradient */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-medium">
            {typingUsers.map(user => user.username).join(', ')}
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
            {typingUsers.length === 1 ? 'is typing...' : 'are typing...'}
          </span>
        </div>
        
        {/* Pulsing border animation */}
        <div className="ml-auto">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse-soft"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;