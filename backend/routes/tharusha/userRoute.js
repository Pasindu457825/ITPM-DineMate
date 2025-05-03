//userroutenew
// routes/tharusha/userRoute.js

const express     = require("express");
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const nodemailer  = require("nodemailer");
const User        = require("../../models/tharusha/userModel");
const {
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../controllers/tharusha/userController");

const router = express.Router();

/* ───────── JWT Middleware ───────── */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token  = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch {
    return res.status(401).json({ message: "Bad or expired token" });
  }
};

/* ───────── Nodemailer setup ───────── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ───────── Public routes ───────── */
// 1) Regular User Signup
router.post("/signup/user", registerUser);

// 2) Restaurant Manager Signup
router.post("/signup/manager", registerUser);

// 3) Common Login
router.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      role: user.role,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ───────── 4) LIST ALL USERS (no token required) ───────── */
router.get("/", async (_req, res) => {
  try {
    const users = await User.find().select("-pwd -resetOTP -resetOTPExpires");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ───────── Protected CRUD ───────── */
// 5) Get Current User ("My Profile")
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-pwd");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 6) Update User Profile
router.put("/:id", requireAuth, updateUser);

// 7) Delete User
router.delete("/:id", requireAuth, deleteUser);

/* ───────── OTP Forgot-Password ───────── */
router.post("/forgot-password-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If an account exists, an OTP has been sent." });
    }

    const otp = ("" + Math.floor(100000 + Math.random() * 900000)).slice(-6);
    user.resetOTP        = await bcrypt.hash(otp, 10);
    user.resetOTPExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to:   user.email,
      subject: "Your Password-Reset OTP",
      text:  `Hello ${user.fname}, your OTP is ${otp}. It expires in 15 minutes.`,
    });

    res.json({ message: "If an account exists, an OTP has been sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ───────── Reset Password with OTP ───────── */
router.post("/reset-password-otp", async (req, res) => {
  try {
    const { email, otp, newPwd } = req.body;
    const user = await User.findOne({ email });
    if (!user || Date.now() > user.resetOTPExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.pwd = await bcrypt.hash(newPwd, 10);
    user.resetOTP = user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;