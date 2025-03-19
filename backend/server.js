const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Import your models
const User = require("./models/tharusha/userModel");

// Import your routes
// pasindu
const orderRoutes = require("./routes/pasindu/orderRoutes");
const reservationRoutes = require("./routes/pasindu/reservationRoutes");


// tharusha
const userRoutes = require("./routes/tharusha/userRoute");

const foodItemRoutes = require("./routes/pamaa/foodItemRoutes");
const restaurantRoutes = require("./routes/pamaa/restaurantRoutes");

// isuri - Payment Management
const paymentRoutes = require("./routes/Isuri/paymentRoutes");



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    createDefaultAdmin(); // Ensure default admin exists
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Route definitions
app.use("/api/ITPM/orders", orderRoutes);
app.use("/api/ITPM/reservations", reservationRoutes);

app.use("/api/ITPM/users", userRoutes);

app.use("/api/ITPM/foodItems", foodItemRoutes);
app.use("/api/ITPM/restaurants", restaurantRoutes);

app.use("/api/ITPM/payments", paymentRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Function to create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPwd = await bcrypt.hash(adminPassword, 10); // Hash password

      const adminUser = new User({
        fname: "Admin",
        lname: "User",
        email: adminEmail,
        pwd: hashedPwd,
        phone_no: "1234567890",
        role: "admin",
      });

      await adminUser.save();
      console.log(`Default admin created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};
