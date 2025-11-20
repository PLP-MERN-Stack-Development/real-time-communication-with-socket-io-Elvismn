import React from 'react';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = () => {
  const { users, activeRoom, switchRoom, isConnected } = useSocketContext();

  const rooms = [
    { id: 'general', name: 'General', description: 'Main chat room', icon: '💬' },
    { id: 'random', name: 'Random', description: 'Off-topic discussions', icon: '🎲' },
    { id: 'tech', name: 'Tech', description: 'Technology talks', icon: '💻' },
    { id: 'games', name: 'Games', description: 'Gaming discussions', icon: '🎮' }
  ];

  return (
    <div className="w-80 bg-white/90 backdrop-blur-md border-r border-gray-200/60 h-full flex flex-col shadow-lg">
      {/* Connection Status Banner */}
      <div className={`p-4 border-b ${isConnected ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {isConnected ? 'Live Connection' : 'Disconnected'}
              </p>
              <p className="text-xs text-gray-600">
                {isConnected ? 'Real-time chat active' : 'Check your connection'}
              </p>
            </div>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-white border shadow-sm">
            {users.length} online
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="p-6 border-b border-gray-200/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Chat Rooms</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {rooms.length} rooms
          </span>
        </div>
        <div className="space-y-2">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => switchRoom(room.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group border-2 ${
                activeRoom === room.id
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md transform scale-105'
                  : 'bg-white border-transparent hover:border-blue-100 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-lg transition-transform duration-300 group-hover:scale-110 ${
                  activeRoom === room.id ? 'scale-110' : ''
                }`}>
                  {room.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-sm ${
                      activeRoom === room.id ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {room.name}
                    </span>
                    {activeRoom === room.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${
                    activeRoom === room.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {room.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Online Users Section */}
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Online Users</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {users.length} online
          </span>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">No users online</p>
            <p className="text-xs text-gray-400 mt-1">Invite friends to start chatting!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.userId} className="flex items-center space-x-3 p-3 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-600">
                    Online now
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/60 bg-gray-50/50">
        <p className="text-xs text-gray-500 text-center">
          ChatApp • Real-time messaging
        </p>
      </div>
    </div>
  );
};

export default Sidebar;