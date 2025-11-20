const express = require('express');
const {
  getMessages,
  getPrivateMessages,
  deleteMessage,
  markAsRead,
  addReaction,
  removeReaction,
  searchMessages
} = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/', getMessages);
router.get('/search', searchMessages);
router.get('/private/:userId', getPrivateMessages);
router.put('/:id/read', markAsRead);
router.post('/:id/reaction', addReaction);
router.delete('/:id/reaction', removeReaction);
router.delete('/:id', deleteMessage);

module.exports = router;