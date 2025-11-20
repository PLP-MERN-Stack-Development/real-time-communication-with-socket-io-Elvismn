import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeRoom, setActiveRoom] = useState('general');
  const [rooms, setRooms] = useState([]);
  
  const {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
    leaveRoom
  } = useSocket();

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔵 Connecting socket for user:', user.username);
      connect(user);
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user, connect, disconnect]);

  // Join general room by default
  useEffect(() => {
    if (isConnected) {
      console.log('🔵 Joining general room');
      joinRoom('general');
    }
  }, [isConnected, joinRoom]);

  const switchRoom = (roomName) => {
    if (activeRoom !== roomName) {
      leaveRoom(activeRoom);
      setActiveRoom(roomName);
      joinRoom(roomName);
    }
  };

  const sendChatMessage = (content) => {
    console.log('🔵 Sending message:', { content, activeRoom });
    sendMessage(content, activeRoom);
  };

  // Filter messages for the active room
  const filteredMessages = messages.filter(msg => {
    // Show system messages in all rooms
    if (msg.system) return true;
    
    // Show room messages for active room
    if (msg.room === activeRoom) return true;
    
    // Show private messages involving current user
    if (msg.isPrivate && (msg.recipient?._id === user?.id || msg.sender?._id === user?.id)) {
      return true;
    }
    
    return false;
  });

  const value = {
    socket,
    isConnected,
    messages: filteredMessages,
    users,
    typingUsers: typingUsers.filter(user => user.room === activeRoom),
    activeRoom,
    rooms,
    sendMessage: sendChatMessage,
    sendPrivateMessage,
    setTyping: (isTyping) => setTyping(isTyping, activeRoom),
    switchRoom,
    joinRoom,
    leaveRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};