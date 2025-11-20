const Room = require('../models/Room');
const Message = require('../models/Message');

const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate = false } = req.body;

    // Check if room already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room with this name already exists'
      });
    }

    const room = await Room.create({
      name,
      description,
      createdBy: req.userId,
      isPrivate,
      members: [req.userId] // Creator is automatically a member
    });

    const populatedRoom = await Room.findById(room._id)
      .populate('createdBy', 'username')
      .populate('members', 'username');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room: populatedRoom }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const rooms = await Room.find({ 
      $or: [
        { isPrivate: false },
        { members: req.userId }
      ]
    })
    .populate('createdBy', 'username')
    .populate('members', 'username')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Room.countDocuments({
      $or: [
        { isPrivate: false },
        { members: req.userId }
      ]
    });

    res.json({
      success: true,
      data: {
        rooms,
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

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({
      _id: id,
      $or: [
        { isPrivate: false },
        { members: req.userId }
      ]
    })
    .populate('createdBy', 'username')
    .populate('members', 'username');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or access denied'
      });
    }

    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.isPrivate) {
      return res.status(403).json({
        success: false,
        message: 'Cannot join private room without invitation'
      });
    }

    // Add user to members if not already a member
    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }

    const populatedRoom = await Room.findById(room._id)
      .populate('createdBy', 'username')
      .populate('members', 'username');

    res.json({
      success: true,
      message: 'Joined room successfully',
      data: { room: populatedRoom }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const leaveRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Remove user from members
    room.members = room.members.filter(member => 
      member.toString() !== req.userId.toString()
    );

    // If no members left and not general room, delete the room
    if (room.members.length === 0 && room.name !== 'general') {
      await Room.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Left room and room deleted (no members left)'
      });
    }

    await room.save();

    res.json({
      success: true,
      message: 'Left room successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({
      _id: id,
      createdBy: req.userId
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or you are not the creator'
      });
    }

    await Room.findByIdAndDelete(id);
    
    // Also delete all messages in this room
    await Message.deleteMany({ room: room.name });

    res.json({
      success: true,
      message: 'Room deleted successfully'
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
  createRoom,
  getRooms,
  getRoom,
  joinRoom,
  leaveRoom,
  deleteRoom
};