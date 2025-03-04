// controllers/restaurantController.js
const Restaurant = require("../../models/pamaa/restaurantModel"); // Assuming the path is correct

// Add new restaurant
const addRestaurant = async (req, res) => {
  const {
    name,
    description,
    location,
    phoneNumber,
    numberOfTables,
    seatsPerTable,
  } = req.body;

  if (
    !name ||
    !description ||
    !location ||
    !phoneNumber ||
    !numberOfTables ||
    !seatsPerTable
  ) {
    return res.status(400).json({ message: "Required fields are missing" }); // Ensure all required fields are sent
  }

  try {
    const newRestaurant = new Restaurant({
      name,
      description,
      location,
      phoneNumber,
      numberOfTables,
      seatsPerTable,
    });
    await newRestaurant.save();
    res
      .status(201)
      .json({
        message: "Restaurant added successfully",
        restaurant: newRestaurant,
      });
  } catch (error) {
    console.error("Error in adding restaurant:", error); // Detailed logging
    res
      .status(500)
      .json({ message: "Error adding restaurant", error: error.message });
  }
};

// Get one restaurant by ID
const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id); // Using Mongoose's findById method
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found with ID: " + id });
    }
    res.json(restaurant); // Return the restaurant data as JSON
  } catch (error) {
    console.error("Error fetching restaurant with ID: " + id + ":", error);
    res
      .status(500)
      .json({ message: "Server error while retrieving restaurant" });
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

// Update restaurant
const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    location,
    phoneNumber,
    numberOfTables,
    seatsPerTable,
  } = req.body;

  try {
    // Find the restaurant by its ID and update it
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        name,
        description,
        location,
        phoneNumber,
        numberOfTables,
        seatsPerTable,
      }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedRestaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found with ID: " + id });
    }

    res.status(200).json(updatedRestaurant); // Return the updated restaurant
  } catch (error) {
    console.error("Error updating restaurant with ID: " + id + ":", error);
    res.status(500).json({ message: "Server error while updating restaurant" });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the restaurant by its ID
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found with ID: " + id });
    }

    res
      .status(200)
      .json({
        message: "Restaurant deleted successfully",
        restaurant: deletedRestaurant,
      });
  } catch (error) {
    console.error("Error deleting restaurant with ID: " + id + ":", error);
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
