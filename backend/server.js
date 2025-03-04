const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Import your routes

//pasindu
const orderRoutes = require("./routes/pasindu/orderRoutes");
const reservationRoutes = require("./routes/pasindu/reservationRoutes");

//tharusha
const userRoutes = require("./routes/tharusha/userRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route definitions
app.use("/api/ITPM/orders", orderRoutes);
app.use("/api/ITPM/reservations", reservationRoutes);
// Add your user management route
app.use("/api/ITPM/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
