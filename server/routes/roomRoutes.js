const express = require('express');
const {
  createRoom,
  getRooms,
  getRoom,
  joinRoom,
  leaveRoom,
  deleteRoom
} = require('../controllers/roomController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

router.post('/', createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/:id/join', joinRoom);
router.post('/:id/leave', leaveRoom);
router.delete('/:id', deleteRoom);

module.exports = router;