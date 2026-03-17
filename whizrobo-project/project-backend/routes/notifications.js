const express = require("express");
const Notification = require("../models/Notification");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("_id title message type isRead createdAt");

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    return res.json({ notifications, unreadCount });
  } catch {
    return res.status(500).json({ msg: "Unable to load notifications." });
  }
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    ).select("_id title message type isRead createdAt");

    if (!updated) return res.status(404).json({ msg: "Notification not found." });
    return res.json({ notification: updated });
  } catch {
    return res.status(500).json({ msg: "Unable to update notification." });
  }
});

router.patch("/read/all", requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    return res.json({ msg: "All notifications marked as read." });
  } catch {
    return res.status(500).json({ msg: "Unable to update notifications." });
  }
});

module.exports = router;
