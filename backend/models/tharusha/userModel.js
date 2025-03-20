const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["registered_user", "restaurant_manager", "admin"],
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    // New fields for OTP-based reset
    resetOTP: String,
    resetOTPExpires: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
