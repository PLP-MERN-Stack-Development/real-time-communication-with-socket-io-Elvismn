import { useEffect, useState, useCallback } from 'react';
import { socket } from '../socket/socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const connect = useCallback((user) => {
    socket.connect();
    if (user) {
      socket.emit('user_join', { userId: user.id, username: user.username });
    }
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  const sendMessage = useCallback((content, room = 'general') => {
    socket.emit('send_message', { content, room });
  }, []);

  const sendPrivateMessage = useCallback((to, content) => {
    socket.emit('private_message', { to, message: content });
  }, []);

  const setTyping = useCallback((isTyping, room = 'general') => {
    socket.emit('typing', { isTyping, room });
  }, []);

  const joinRoom = useCallback((roomName) => {
    socket.emit('join_room', roomName);
  }, []);

  const leaveRoom = useCallback((roomName) => {
    socket.emit('leave_room', roomName);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log('✅ Connected to server');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('❌ Disconnected from server');
    };

    const onReceiveMessage = (message) => {
      console.log('📨 Received message:', message);
      setMessages(prev => [...prev, { 
        ...message, 
        id: message._id || message.id,
        // Ensure consistent field names
        content: message.content || message.message,
        timestamp: message.timestamp || message.createdAt
      }]);
    };

    const onUserList = (userList) => {
      console.log('👥 User list updated:', userList);
      setUsers(userList);
    };

    const onUserJoined = (userData) => {
      console.log('🟢 User joined:', userData);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${userData.username} joined the chat`,
          timestamp: new Date().toISOString(),
        }
      ]);
    };

    const onUserLeft = (userData) => {
      console.log('🔴 User left:', userData);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${userData.username} left the chat`,
          timestamp: new Date().toISOString(),
        }
      ]);
    };

    const onTypingUsers = (users) => {
      console.log('⌨️ Typing users:', users);
      setTypingUsers(users);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);

    // Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
    };
  }, []);

  return {
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
  };
};