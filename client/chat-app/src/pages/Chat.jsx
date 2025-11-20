import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import TypingIndicator from '../components/chat/TypingIndicator';

const Chat = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm border-l border-gray-200/60">
          <ChatHeader />
          <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList />
            <TypingIndicator />
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;