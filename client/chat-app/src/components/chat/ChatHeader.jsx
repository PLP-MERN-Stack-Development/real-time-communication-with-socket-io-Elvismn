import React from 'react';
import { useSocketContext } from '../../context/SocketContext';

const ChatHeader = () => {
  const { activeRoom, users } = useSocketContext();

  const roomDisplayName = activeRoom.charAt(0).toUpperCase() + activeRoom.slice(1);

  return (
    <div className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">#{roomDisplayName}</h2>
          <p className="text-sm text-gray-500">
            {users.length} {users.length === 1 ? 'user' : 'users'} online
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Room actions can be added here */}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;