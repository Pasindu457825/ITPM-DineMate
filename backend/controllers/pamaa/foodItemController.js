const mongoose = require("mongoose");
const FoodItem = require("../../models/pamaa/foodItemModel");
const Restaurant = require("../../models/pamaa/restaurantModel");

// Add new food item with image URL
const addFoodItem = async (req, res) => {
  try {
    const { restaurantId, name, description, price, category, available, image } = req.body;

    if (!restaurantId || !name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const itemPrice = parseFloat(price);
    if (isNaN(itemPrice) || itemPrice < 0) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newFoodItem = new FoodItem({
      restaurantId,
      restaurantName: restaurant.name,
      name,
      description,
      price: itemPrice,
      category,
      available,
      image,
    });

    await newFoodItem.save();
    res.status(201).json({ message: "Food item added successfully", foodItem: newFoodItem });
  } catch (error) {
    console.error("Error in addFoodItem:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all food items
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: "Server error while retrieving food items", error: error.message });
  }
};

// Get a food item by ID
const getFoodItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: "Server error while retrieving food item", error: error.message });
  }
};

// Update food item including image URL
const updateFoodItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, available, image } = req.body;

  try {
    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id,
      { name, description, price, category, available, image },
      { new: true }
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json(updatedFoodItem);
  } catch (error) {
    res.status(500).json({ message: "Server error while updating food item", error: error.message });
  }
};

// Delete food item
const deleteFoodItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
    if (!deletedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting food item", error: error.message });
  }
};

// Get all food items for a specific restaurant
const getFoodsByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    const restaurant = await Restaurant.findById(restaurantId).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foodItems = await FoodItem.find({ restaurantId }).lean();

    res.json({
      restaurantName: restaurant.name,
      foods: foodItems || [],
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error while retrieving food items", error: error.message });
  }
};

// Toggle the availability of a food item
const toggleFoodItemAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    foodItem.available = !foodItem.available;
    await foodItem.save();

    res.status(200).json({ message: "Food item availability toggled successfully", foodItem });
  } catch (error) {
    res.status(500).json({ message: "Server error while toggling food item availability", error: error.message });
  }
};

// Export all controllers
module.exports = {
  addFoodItem,
  getFoodItemById,
  getAllFoodItems,
  updateFoodItem,
  deleteFoodItem,
  getFoodsByRestaurant,
  toggleFoodItemAvailability,
};
