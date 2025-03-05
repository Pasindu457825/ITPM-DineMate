const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS middleware
const orderRoutes = require("./routes/pasindu/orderRoutes");
const reservationRoutes = require("./routes/pasindu/reservationRoutes");

const foodItemRoutes = require("./routes/pamaa/foodItemRoutes");
const restaurantRoutes = require("./routes/pamaa/restaurantRoutes");

const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use the routes
app.use("/api/ITPM/orders", orderRoutes);
app.use("/api/ITPM/reservations", reservationRoutes);
app.use("/api/ITPM/foodItems", foodItemRoutes);
app.use("/api/ITPM/restaurants", restaurantRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
