const Notification = require('../models/Notification');

// ─── 1. GET /api/notifications ────────────────────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.status(200).json({ success: true, data: { notifications } });
  } catch (error) {
    next(error);
  }
};

// ─── 2. PUT /api/notifications/:id/read ───────────────────────────────────────
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.status(200).json({ success: true, data: { notification } });
  } catch (error) {
    next(error);
  }
};

// ─── 3. PUT /api/notifications/mark-all-read ──────────────────────────────────
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};

// ─── 4. GET /api/notifications/unread-count ───────────────────────────────────
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
