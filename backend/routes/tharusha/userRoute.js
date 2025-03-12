const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/tharusha/userModel");

const router = express.Router();

// User Signup
router.post("/register", async (req, res) => {
    const { fname, lname, email, pwd, phone_no } = req.body;

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = new User({ fname, lname, email, pwd: hashedPwd, phone_no, role: "registered_user" });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Restaurant Manager Signup
router.post("/register/manager", async (req, res) => {
    const { fname, lname, email, pwd, phone_no } = req.body;

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newManager = new User({ fname, lname, email, pwd: hashedPwd, phone_no, role: "restaurant_manager" });
        await newManager.save();
        res.status(201).json({ message: "Restaurant Manager registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Common Login Route - No change needed
router.post("/login", async (req, res) => {
    const { email, pwd } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(pwd, user.pwd);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
