const mongoose = require("mongoose"); // ✅ Ensure mongoose is imported
const FoodItem = require("../../models/pamaa/foodItemModel");
const Restaurant = require("../../models/pamaa/restaurantModel");

// ✅ Add new food item
const addFoodItem = async (req, res) => {
  const { restaurantId, name, description, price, category, available } = req.body;

  if (!restaurantId || !name || !description || !price || !category) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    // ✅ Convert price to a number
    const itemPrice = parseFloat(price);
    if (isNaN(itemPrice) || itemPrice < 0) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    // ✅ Fetch restaurant details using restaurantId
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // ✅ Create new food item with restaurant name included
    const newFoodItem = new FoodItem({
      restaurantId,
      restaurantName: restaurant.name, // Store restaurant's name
      name,
      description,
      price: itemPrice, // Ensure price is stored as a number
      category,
      available,
    });

    await newFoodItem.save();
    res.status(201).json({ message: "Food item added successfully", foodItem: newFoodItem });
  } catch (error) {
    console.error("Error in adding food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get one food item by ID
const getFoodItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.json(foodItem);
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all food items
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().lean(); // ✅ Use .lean() for better performance
    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching all food items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update food item by ID
const updateFoodItemById = async (req, res) => {
  const { id } = req.params;
  const { restaurantId, name, description, price, category, available } = req.body;

  try {
    // ✅ Ensure price is valid
    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    // ✅ Find food item by MongoDB _id and update
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id,
      { restaurantId, name, description, price, category, available },
      { new: true, runValidators: true }
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json(updatedFoodItem);
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete food item by ID
const deleteFoodItemById = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ Find and delete the food item
    const deletedFoodItem = await FoodItem.findByIdAndDelete(id);

    if (!deletedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully", foodItem: deletedFoodItem });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all food items for a specific restaurant
const getFoodsByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // ✅ Fetch food items that belong to this restaurant
    const foodItems = await FoodItem.find({ restaurantId }).lean();

    if (!foodItems.length) {
      return res.status(404).json({ message: "No food items found for this restaurant" });
    }

    // ✅ Get the restaurant name from the first food item
    const restaurantName = foodItems[0].restaurantName;

    res.json({
      restaurantName, // ✅ Send restaurant name
      foods: foodItems, // ✅ Send food items
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Export all controllers
module.exports = {
  addFoodItem,
  getFoodItemById,
  getAllFoodItems,
  updateFoodItemById,
  deleteFoodItemById,
  getFoodsByRestaurant,
};
