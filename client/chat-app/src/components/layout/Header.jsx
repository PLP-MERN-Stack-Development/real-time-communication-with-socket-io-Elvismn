import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { isConnected, users } = useSocketContext();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChatApp
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                  <span>•</span>
                  <span>{users.length} users online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - User info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Welcome, <span className="text-blue-600">{user?.username}</span>
              </p>
              <p className="text-xs text-gray-500">
                Ready to chat
              </p>
            </div>
            
            {/* User avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            
            {/* Logout button */}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-300/50 hover:border-gray-400/50 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;