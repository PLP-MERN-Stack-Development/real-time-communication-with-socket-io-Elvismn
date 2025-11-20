const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

const getMessages = async (req, res) => {
  try {
    const { room = 'general', page = 1, limit = 50 } = req.query;

    // Check if user has access to the room
    if (room !== 'general') {
      const roomData = await Room.findOne({
        name: room,
        $or: [
          { isPrivate: false },
          { members: req.userId }
        ]
      });

      if (!roomData) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this room'
        });
      }
    }

    const messages = await Message.find({ room })
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .populate('readBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ room });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to get chronological order
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getPrivateMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { 
          sender: req.userId, 
          recipient: userId,
          isPrivate: true 
        },
        { 
          sender: userId, 
          recipient: req.userId,
          isPrivate: true 
        }
      ]
    })
    .populate('sender', 'username')
    .populate('recipient', 'username')
    .sort({ createdAt: 1 }) // Chronological order for private messages
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      $or: [
        { 
          sender: req.userId, 
          recipient: userId,
          isPrivate: true 
        },
        { 
          sender: userId, 
          recipient: req.userId,
          isPrivate: true 
        }
      ]
    });

    res.json({
      success: true,
      data: {
        messages,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findOne({
      _id: id,
      sender: req.userId // Users can only delete their own messages
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or access denied'
      });
    }

    await Message.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is recipient or in the same room
    if (message.isPrivate) {
      if (message.recipient.toString() !== req.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Add user to readBy if not already there
    if (!message.readBy.includes(req.userId)) {
      message.readBy.push(req.userId);
      await message.save();
    }

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .populate('readBy', 'username');

    res.json({
      success: true,
      message: 'Message marked as read',
      data: { message: populatedMessage }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const addReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      reaction => reaction.user.toString() !== req.userId.toString()
    );

    // Add new reaction
    message.reactions.push({
      user: req.userId,
      emoji
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .populate('readBy', 'username')
      .populate('reactions.user', 'username');

    res.json({
      success: true,
      message: 'Reaction added',
      data: { message: populatedMessage }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const removeReaction = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove user's reaction
    message.reactions = message.reactions.filter(
      reaction => reaction.user.toString() !== req.userId.toString()
    );

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .populate('readBy', 'username')
      .populate('reactions.user', 'username');

    res.json({
      success: true,
      message: 'Reaction removed',
      data: { message: populatedMessage }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const searchMessages = async (req, res) => {
  try {
    const { query, room, page = 1, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchFilter = {
      content: { $regex: query, $options: 'i' }
    };

    // If room is specified, only search in that room
    if (room && room !== 'all') {
      searchFilter.room = room;
    }

    const messages = await Message.find(searchFilter)
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(searchFilter);

    res.json({
      success: true,
      data: {
        messages,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getMessages,
  getPrivateMessages,
  deleteMessage,
  markAsRead,
  addReaction,
  removeReaction,
  searchMessages
};