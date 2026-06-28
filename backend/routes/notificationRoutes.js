const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require('../controllers/notificationController');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllAsRead); // MUST be before /:id
router.put('/:id/read', markAsRead);

module.exports = router;
