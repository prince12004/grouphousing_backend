const User = require("../models/User");
const Notification = require("../models/Notification");
const {
  generateToken,
  generateRefreshToken,
  generateOTP,
} = require("../utils/helpers");
const { sendOTPEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;
    if (!fullName || !email || !mobile || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });

    const otp = generateOTP();
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      mobile,
      password,
      emailOTP: otp,
      emailOTPExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    const emailResult = await sendOTPEmail({ to: email, name: fullName, otp });
    if (!emailResult.success)
      console.error("OTP email failed:", emailResult.error);

    res
      .status(201)
      .json({
        success: true,
        message: "Registration successful! Please verify your email.",
        userId: user._id,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: "Already verified." });
    if (user.emailOTP !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    if (new Date() > user.emailOTPExpiry)
      return res.status(400).json({ success: false, message: "OTP expired." });

    user.isVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save();

    await Notification.create({
      user: user._id,
      title: "Welcome to GroupHousing Pro!",
      message: "Your account has been verified.",
      type: "system",
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Email verified!",
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password +refreshToken",
    );
    if (!user || !(await user.matchPassword(password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    if (!user.isActive)
      return res
        .status(401)
        .json({
          success: false,
          message: "Account suspended. Contact support.",
        });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Login successful!",
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token." });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken)
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token." });

    const newToken = generateToken(user._id);
    res.json({ success: true, token: newToken });
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token." });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "wishlist",
      "title slug coverImage pricing.startingPrice location.city",
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, mobile, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, mobile, avatar },
      { new: true, runValidators: true },
    );
    res.json({ success: true, message: "Profile updated.", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword)))
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
