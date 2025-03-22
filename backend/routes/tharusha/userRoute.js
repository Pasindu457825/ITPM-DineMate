// userRoute.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/tharusha/userModel");

const router = express.Router();

// =============================
// 1) JWT Middleware
// =============================
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Malformed token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // e.g. { userId: "...", role: "..." }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =============================
// 2) Nodemailer Setup
// =============================
// Use environment variables: EMAIL_USER and EMAIL_PASS
// e.g. .env file:
// EMAIL_USER=mygmail@gmail.com
// EMAIL_PASS=mygmailapppassword

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email provider
  auth: {
    user: process.env.EMAIL_USER, // e.g. "mygmail@gmail.com"
    pass: process.env.EMAIL_PASS, // e.g. "supersecretappassword"
  },
});

// ===================================
// 3) Regular User Signup
// POST /signup/user
// ===================================
router.post("/signup/user", async (req, res) => {
  const { fname, lname, email, pwd, phone_no } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = new User({
      fname,
      lname,
      email,
      pwd: hashedPwd,
      phone_no,
      role: "registered_user",
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================================
// 4) Restaurant Manager Signup
// POST /signup/manager
// ===================================
router.post("/signup/manager", async (req, res) => {
  const { fname, lname, email, pwd, phone_no } = req.body;
  try {
    const existingManager = await User.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: "Manager with this email already exists" });
    }
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newManager = new User({
      fname,
      lname,
      email,
      pwd: hashedPwd,
      phone_no,
      role: "restaurant_manager",
    });
    await newManager.save();
    res.status(201).json({ message: "Restaurant Manager registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================================
// 5) Common Login
// POST /login
// Returns a JWT token upon success
// ===================================
router.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      role: user.role,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================================
// 6) Get Current User ("My Profile")
// GET /me
// Protected route (needs valid token)
// ===================================
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-pwd");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================================
// 7) Update User Profile
// PUT /:id
// Protected route – allows a user (or admin) to update their details
// ===================================
router.put("/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }
    const { fname, lname, email, phone_no } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fname, lname, email, phone_no },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================================
// 8) Delete User
// DELETE /:id
// Protected route – allows a user or admin to delete a user
// ===================================
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this profile" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================================
// 9) Forgot Password (OTP) – POST /forgot-password-otp
// Generates a 6-digit OTP, hashes it, emails it, and stores it in user record
// ===================================
router.post("/forgot-password-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond success to avoid revealing if email doesn't exist
    if (!user) {
      return res.status(200).json({ message: "If an account exists, an OTP has been sent." });
    }

    // 1) Generate a 6-digit OTP
    const otp = ("" + Math.floor(100000 + Math.random() * 900000)).slice(-6);

    // 2) Hash the OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // 3) Store hashedOTP & expiry in DB
    user.resetOTP = hashedOTP;
    user.resetOTPExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // 4) Send plain OTP via email
    const mailOptions = {
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Password Reset OTP",
      text: `Hello ${user.fname},\n\nYour OTP code is: ${otp}\nIt will expire in 15 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nRegards,\nMyApp Team`,
      // html: `<p>Hello <strong>${user.fname}</strong>,<br />Your OTP code is <strong>${otp}</strong>...</p>`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent if the account exists." });
  } catch (error) {
    console.error("Error in forgot-password-otp:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ===================================
// 10) Reset Password with OTP – POST /reset-password-otp
// Compares user input OTP with hashed OTP in DB, resets password if valid
// ===================================
router.post("/reset-password-otp", async (req, res) => {
  try {
    const { email, otp, newPwd } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Check expiry
    if (Date.now() > user.resetOTPExpires) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare provided OTP with hashed OTP in DB
    const isMatch = await bcrypt.compare(otp, user.resetOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP valid; reset password
    const hashedPwd = await bcrypt.hash(newPwd, 10);
    user.pwd = hashedPwd;

    // Clear OTP fields
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error in reset-password-otp:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
