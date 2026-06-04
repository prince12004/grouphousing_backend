const User = require('../models/User');
const Notification = require('../models/Notification');
const Project = require('../models/Project');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title slug coverImage pricing location.city roi.expectedROI status slots');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { projectId } = req.body;
    const user = await User.findById(req.user._id);
    const isWishlisted = user.wishlist.includes(projectId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== projectId);
      await Project.findByIdAndUpdate(projectId, { $inc: { wishlisted: -1 } });
    } else {
      user.wishlist.push(projectId);
      await Project.findByIdAndUpdate(projectId, { $inc: { wishlisted: 1 } });
    }
    await user.save();

    res.json({ success: true, isWishlisted: !isWishlisted, message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'Notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
