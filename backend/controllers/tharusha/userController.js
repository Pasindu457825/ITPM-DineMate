const bcrypt = require("bcryptjs");
const User = require("../../models/tharusha/userModel");

/**
 * @desc    Register a new user (or restaurant manager)
 * @route   POST /api/users/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { fname, lname, email, pwd, phone_no, role } = req.body;

    // Check for existing user by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create new user document
    const newUser = new User({
      fname,
      lname,
      email,
      pwd: hashedPwd,
      phone_no,
      role: role || "registered_user" // default to 'registered_user' if not provided
    });

    // Save to DB
    const savedUser = await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Login user (common login for all roles)
 * @route   POST /api/users/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If you want to generate a JWT:
    // const token = jwt.sign(
    //   { userId: user._id, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );

    // Return success with user details (and optionally a token)
    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      userId: user._id,
      // token
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get all users (for admin or testing)
 * @route   GET /api/users
 * @access  Private (usually restricted to admin or manager)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/users/:id
 * @access  Private
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fname, lname, email, phone_no, role } = req.body;

    // If also updating password, remember to hash it again
    // Example:
    // let updatedFields = { fname, lname, email, phone_no, role };
    // if (req.body.pwd) {
    //   updatedFields.pwd = await bcrypt.hash(req.body.pwd, 10);
    // }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fname,
        lname,
        email,
        phone_no,
        role
      },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
