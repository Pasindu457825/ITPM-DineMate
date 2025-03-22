const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name cannot exceed 50 characters"],
        match: [/^[a-zA-Z\s-]+$/, "First name can only contain letters, spaces, and hyphens"]
    },
    lname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"],
        match: [/^[a-zA-Z\s-]+$/, "Last name can only contain letters, spaces, and hyphens"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
        index: true
    },
    pwd: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        // Basic password complexity requirement (at least one letter and one number)
        match: [/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must contain at least one letter and one number"]
    },
   
    role: {
        type: String,
        enum: ["registered_user", "restaurant_manager", "admin"],
        required: true
    },
    phone_no: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        // Sri Lankan phone number format: 10 digits starting with 0 or with country code +94
        match: [/^(?:\+94\d{9}|0\d{9})$/, "Please enter a valid Sri Lankan phone number (e.g., 0712345678 or +94712345678)"],
        validate: {
            validator: function(v) {
                // Remove +94 if present and check length
                const cleaned = v.startsWith('+94') ? v.replace('+94', '') : v.replace(/^0/, '');
                return cleaned.length === 9; // 9 digits after country code or leading zero
            },
            message: "Phone number must be exactly 10 digits including the mobile code"
        }
    },
    // New fields for OTP-based reset
    resetOTP: String,
    resetOTPExpires: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
