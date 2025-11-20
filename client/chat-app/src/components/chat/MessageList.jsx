import React, { useEffect, useRef } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const MessageList = () => {
  const { messages } = useSocketContext();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  console.log('📨 Messages in MessageList:', messages); // Debug log

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-br from-gray-50 to-blue-50/30">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600">No messages yet</p>
          <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.sender?._id === user?.id || message.senderId === user?.id;
          const isSystemMessage = message.system;
          
          return (
            <div
              key={message.id || message._id}
              className={`message-animation flex ${
                isOwnMessage ? 'justify-end' : 'justify-start'
              }`}
            >
              {isSystemMessage ? (
                // System message - Premium styling
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 rounded-2xl px-4 py-2 max-w-md mx-auto backdrop-blur-sm">
                  <p className="text-xs text-blue-600 text-center font-medium">{message.message}</p>
                  <p className="text-xs text-blue-400 text-center mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              ) : (
                // User message - Premium chat bubbles
                <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-lg ${
                  isOwnMessage
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm'
                }`}>
                  {!isOwnMessage && message.sender?.username && (
                    <p className={`text-xs font-semibold mb-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-blue-600'
                    }`}>
                      {message.sender.username}
                    </p>
                  )}
                  <p className="text-sm break-words leading-relaxed">
                    {message.content || message.message}
                  </p>
                  <p className={`text-xs mt-2 ${
                    isOwnMessage ? 'text-blue-100/80' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp || message.createdAt)}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;