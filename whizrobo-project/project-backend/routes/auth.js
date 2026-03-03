const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LoginAttempt = require("../models/LoginAttempt");
const { COOKIE_NAME, requireAuth } = require("../middleware/auth");

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_MAX_AGE_MS = Number(process.env.AUTH_COOKIE_MAX_AGE_MS || 60 * 60 * 1000);

const getClientIp = (req) => {
  const xff = req.headers["x-forwarded-for"];
  if (xff && typeof xff === "string") {
    return xff.split(",")[0].trim();
  }
  return req.ip || "";
};

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "strict" : "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "Valid email is required.";
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return "";
};

router.post("/register", async (req, res) => {
  const { name = "", email = "", password = "" } = req.body || {};

  try {
    const inputError = validateRegisterInput({ name, email, password });
    if (inputError) return res.status(400).json({ msg: inputError });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    setAuthCookie(res, token);

    res.status(201).json({ user: sanitizeUser(newUser) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email = "", password = "" } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const ipAddress = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "";

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      await LoginAttempt.create({
        email: normalizedEmail,
        success: false,
        ipAddress,
        userAgent,
      });
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginAttempt.create({
        email: normalizedEmail,
        success: false,
        userId: user._id,
        ipAddress,
        userAgent,
      });
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    await LoginAttempt.create({
      email: normalizedEmail,
      success: true,
      userId: user._id,
      ipAddress,
      userAgent,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    setAuthCookie(res, token);

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "strict" : "lax",
    path: "/",
  });
  res.json({ msg: "Logged out." });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email");
    if (!user) return res.status(404).json({ msg: "User not found." });
    return res.json({ user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
