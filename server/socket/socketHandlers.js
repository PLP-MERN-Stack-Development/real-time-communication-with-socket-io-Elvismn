const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');

const setupSocketHandlers = (io) => {
  const users = new Map(); // socketId -> user data
  const typingUsers = new Map(); // socketId -> typing data

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins the chat
    socket.on('user_join', async (userData) => {
      try {
        const user = await User.findById(userData.userId);
        if (user) {
          users.set(socket.id, {
            userId: user._id,
            username: user.username,
            socketId: socket.id
          });

          // Update user online status
          user.isOnline = true;
          await user.save();

          // Join general room
          socket.join('general');

          // Notify all users
          io.emit('user_list', Array.from(users.values()));
          socket.broadcast.emit('user_joined', {
            username: user.username,
            userId: user._id,
            timestamp: new Date()
          });

          console.log(`${user.username} joined the chat`);
        }
      } catch (error) {
        console.error('Error in user_join:', error);
      }
    });

    // Handle sending messages
    socket.on('send_message', async (messageData) => {
      try {
        const userData = users.get(socket.id);
        if (!userData) return;

        const message = await Message.create({
          sender: userData.userId,
          content: messageData.content,
          room: messageData.room || 'general',
          isPrivate: messageData.isPrivate || false,
          recipient: messageData.recipient
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username')
          .populate('recipient', 'username');

        if (messageData.isPrivate && messageData.recipient) {
          // Private message
          const recipientSocket = findSocketByUserId(messageData.recipient);
          if (recipientSocket) {
            io.to(recipientSocket).emit('receive_message', populatedMessage);
          }
          socket.emit('receive_message', populatedMessage);
        } else {
          // Room message
          io.to(messageData.room || 'general').emit('receive_message', populatedMessage);
        }
      } catch (error) {
        console.error('Error in send_message:', error);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const userData = users.get(socket.id);
      if (!userData) return;

      if (data.isTyping) {
        typingUsers.set(socket.id, {
          username: userData.username,
          room: data.room
        });
      } else {
        typingUsers.delete(socket.id);
      }

      // Notify others in the same room
      socket.to(data.room || 'general').emit('typing_users', 
        Array.from(typingUsers.values()).filter(u => u.room === data.room)
      );
    });

    // Handle room operations
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      socket.emit('room_joined', roomName);
    });

    socket.on('leave_room', (roomName) => {
      socket.leave(roomName);
      socket.emit('room_left', roomName);
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        const userData = users.get(socket.id);
        if (userData) {
          // Update user offline status
          await User.findByIdAndUpdate(userData.userId, {
            isOnline: false,
            lastSeen: new Date()
          });

          // Remove from users and typing
          users.delete(socket.id);
          typingUsers.delete(socket.id);

          // Notify all users
          io.emit('user_left', {
            username: userData.username,
            userId: userData.userId,
            timestamp: new Date()
          });
          io.emit('user_list', Array.from(users.values()));
          io.emit('typing_users', Array.from(typingUsers.values()));

          console.log(`${userData.username} left the chat`);
        }
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    });
  });

  // Helper function to find socket by user ID
  const findSocketByUserId = (userId) => {
    for (let [socketId, userData] of users.entries()) {
      if (userData.userId.toString() === userId.toString()) {
        return socketId;
      }
    }
    return null;
  };
};

module.exports = setupSocketHandlers;