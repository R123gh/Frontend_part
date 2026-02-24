const mongoose = require("mongoose");

const LoginAttemptSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    success: { type: Boolean, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginAttempt", LoginAttemptSchema);
