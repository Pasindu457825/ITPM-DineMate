const mongoose = require("mongoose");
const Restaurant = require("../../models/pamaa/restaurantModel");
const User = require("../../models/tharusha/userModel"); // Import the User model

const addRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      phoneNumber,
      tables,
      image,
      image360,
      userId,
    } = req.body;

    // Log the request for debugging
    console.log("Creating restaurant with data:", {
      name,
      description,
      location,
      phoneNumber,
      tablesCount: Array.isArray(tables) ? tables.length : "not an array",
      userId,
    });

    // Check if all necessary fields are provided
    if (
      !name ||
      !description ||
      !location ||
      !phoneNumber ||
      !tables ||
      tables.length === 0 ||
      !image ||
      !image360
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userId is provided
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Manager ID (userId) is required" });
    }

    // Check if the user exists and is a manager or admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "restaurant_manager" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only restaurant managers can add restaurants" });
    }

    // Create a new restaurant with multiple table configurations
    const newRestaurant = new Restaurant({
      name,
      description,
      location,
      phoneNumber,
      tables,
      image,
      image360, // ✅ Add this line
      managerId: userId,
    });

    await newRestaurant.save();
    console.log("Restaurant created successfully with ID:", newRestaurant._id);

    res
      .status(201)
      .json({
        message: "Restaurant added successfully",
        restaurant: newRestaurant,
      });
  } catch (error) {
    console.error("Error in addRestaurant:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all restaurants for users
// Get all restaurants pasindu
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all restaurants for a specific manager
const getAllRestaurantsById = async (req, res) => {
  try {
    // Get managerId from query params
    const managerId = req.query.userId;
    console.log("Getting restaurants for managerId:", managerId);

    // Validate managerId
    if (!managerId) {
      return res
        .status(400)
        .json({
          message: "Manager ID (userId) is required in query parameters",
        });
    }

    // Check if the user exists
    const user = await User.findById(managerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is an admin, return all restaurants
    // Otherwise, return only the restaurants managed by this user
    const query = user.role === "admin" ? {} : { managerId };

    const restaurants = await Restaurant.find(query);
    console.log(
      `Found ${restaurants.length} restaurants for ${user.role} with ID ${managerId}`
    );

    res.json(restaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single restaurant by ID
const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId; // Get userId from query for authorization

  try {
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // If userId is provided, verify authorization
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user is not admin and not the manager of this restaurant
      if (user.role !== "admin" && restaurant.managerId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to access this restaurant" });
      }
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res
      .status(500)
      .json({ message: "Server error while retrieving restaurant" });
  }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    location,
    phoneNumber,
    tables,
    image,
    image360,
    userId,
  } = req.body;

  try {
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the restaurant
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check authorization
    if (user.role !== "admin" && restaurant.managerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this restaurant" });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, description, location, phoneNumber, tables, image, image360 }, // ✅ Added image360
      { new: true }
    );

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Server error while updating restaurant" });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId; // Get userId from query for authorization

  try {
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the restaurant
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check authorization
    if (user.role !== "admin" && restaurant.managerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this restaurant" });
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Server error while deleting restaurant" });
  }
};

// Toggle the enabled status of a restaurant
const toggleRestaurantStatus = async (req, res) => {
  const { id } = req.params; // Get restaurant ID from parameters
  const userId = req.query.userId; // Get userId from query for authorization

  try {
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if the user exists and has the correct authorization
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin" && user.role !== "restaurant_manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the restaurant and toggle its enabled status
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Toggle isEnabled status and update the restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { isEnabled: !restaurant.isEnabled },
      { new: true }
    );

    res
      .status(200)
      .json({
        message: "Restaurant status updated successfully",
        restaurant: updatedRestaurant,
      });
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating restaurant status" });
  }
};

module.exports = {
  addRestaurant,
  getRestaurantById,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  getAllRestaurantsById,
};
