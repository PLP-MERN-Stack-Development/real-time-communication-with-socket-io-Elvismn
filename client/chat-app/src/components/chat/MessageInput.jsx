import React, { useState, useRef } from 'react';
import { useSocketContext } from '../../context/SocketContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, setTyping } = useSocketContext();
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      
      // Stop typing indicator
      setTyping(false);
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Handle typing indicator
    if (!isTyping && e.target.value.trim()) {
      setTyping(true);
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200/60 bg-white/95 backdrop-blur-sm p-6">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 placeholder-gray-400 text-gray-700 text-lg shadow-sm hover:shadow-md"
          />
          {/* Microphone icon when empty */}
          {!message.trim() && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Send Button - Premium Styling */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`
            flex items-center justify-center px-6 py-4 rounded-2xl font-semibold text-white
            transition-all duration-300 transform hover:scale-105 active:scale-95
            shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
            bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700
            min-w-[100px]
          `}
        >
          {!message.trim() ? (
            // Paper plane outline when no message
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ) : (
            // Send text with icon when message exists
            <div className="flex items-center gap-2">
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </button>
      </form>
      
      {/* Quick actions */}
      <div className="flex gap-2 mt-3">
        <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-50">
          😊 Emoji
        </button>
        <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-50">
          📎 Attach
        </button>
        <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-50">
          🎙️ Voice
        </button>
      </div>
    </div>
  );
};

export default MessageInput;