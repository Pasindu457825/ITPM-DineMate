const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/tharusha/userModel");

const router = express.Router();

// =============================
// Middleware to verify the JWT
// =============================
const requireAuth = (req, res, next) => {
  try {
    // Expecting header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Malformed token" });
    }
    // Verify token with JWT_SECRET (fallback to "secret" if not set)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // e.g. { userId: "...", role: "..." }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ===================================
// 1) Regular User Signup
// POST /signup/user
// ===================================
router.post("/signup/user", async (req, res) => {
  const { fname, lname, email, pwd, phone_no } = req.body;
  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Create a new user document
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
// 2) Restaurant Manager Signup
// POST /signup/manager
// ===================================
router.post("/signup/manager", async (req, res) => {
  const { fname, lname, email, pwd, phone_no } = req.body;
  try {
    // Check if a manager with this email already exists
    const existingManager = await User.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: "Manager with this email already exists" });
    }
    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Create a new manager document
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
// 3) Common Login
// POST /login
// Returns a JWT token upon success
// ===================================
router.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token (includes userId and role)
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
// 4) Get Current User ("My Profile")
// GET /me
// Protected route (needs valid token)
// ===================================
router.get("/me", requireAuth, async (req, res) => {
  try {
    // Retrieve user by ID from the token, omitting the password field
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
// 5) Update User Profile
// PUT /:id
// Protected route – allows a user (or admin) to update their details
// ===================================
router.put("/:id", requireAuth, async (req, res) => {
  try {
    // Ensure the user is updating their own profile, unless they're an admin
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

module.exports = router;
