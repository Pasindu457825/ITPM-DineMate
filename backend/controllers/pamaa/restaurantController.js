const mongoose = require("mongoose");
const Restaurant = require("../../models/pamaa/restaurantModel");

const addRestaurant = async (req, res) => {
  try {
    const { name, description, location, phoneNumber, tables, image } = req.body;

    // Check if all necessary fields are provided
    if (!name || !description || !location || !phoneNumber || !tables || tables.length === 0 || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new restaurant with multiple table configurations
    const newRestaurant = new Restaurant({
      name,
      description,
      location,
      phoneNumber,
      tables, // Updated to accept an array of table objects
      image,
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant added successfully", restaurant: newRestaurant });

  } catch (error) {
    console.error("Error in addRestaurant:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single restaurant by ID
const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Server error while retrieving restaurant" });
  }
};

// Update restaurant (including its tables)
const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, description, location, phoneNumber, tables, image } = req.body;

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, description, location, phoneNumber, tables, image },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Server error while updating restaurant" });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Server error while deleting restaurant" });
  }
};

module.exports = {
  addRestaurant,
  getRestaurantById,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
};
