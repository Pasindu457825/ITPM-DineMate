// controllers/foodMenuController.js
const FoodItem = require("../../models/pamaa/foodItemModel"); // Assuming you have the correct path

// Add new food item
const addFoodItem = async (req, res) => {
  const { shopId, foodId, name, description, price, category, available } =
    req.body;

  if (!name || !description || !price || !category || !foodId) {
    return res
      .status(400)
      .json({ message: "Required fields including foodId are missing" }); // Ensure all required fields including foodId are sent
  }

  try {
    const newFoodItem = new FoodItem({
      restaurandId,
      foodId,
      name,
      description,
      price,
      category,
      available,
    });
    await newFoodItem.save();
    res
      .status(201)
      .json({ message: "Food item added successfully", foodItem: newFoodItem });
  } catch (error) {
    console.error("Error in adding food item:", error); // Add detailed logging
    res
      .status(500)
      .json({ message: "Error adding food item", error: error.message });
  }
};

// Get one food item by foodId
const getFoodItemByFoodId = async (req, res) => {
  const { foodId } = req.params;
  try {
    const foodItem = await FoodItem.findOne({ foodId }); // Using Mongoose's findOne method to find by foodId
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.json(foodItem); // Return the food item data as JSON
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all food items
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update food item by foodId
const updateFoodItemByFoodId = async (req, res) => {
  const { foodId } = req.params;
  const { shopId, name, description, price, category, available } = req.body;

  try {
    // Find the food item by its foodId and update it
    const updatedFoodItem = await FoodItem.findOneAndUpdate(
      { foodId },
      {
        restaurandId,
        name,
        description,
        price,
        category,
        available,
      }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json(updatedFoodItem); // Return the updated food item
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete food item by foodId
const deleteFoodItemByFoodId = async (req, res) => {
  const { foodId } = req.params;

  try {
    // Find and delete the food item by its foodId
    const deletedFoodItem = await FoodItem.findOneAndDelete({ foodId });

    if (!deletedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({
      message: "Food item deleted successfully",
      foodItem: deletedFoodItem,
    });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addFoodItem,
  getFoodItemByFoodId,
  getAllFoodItems,
  updateFoodItemByFoodId,
  deleteFoodItemByFoodId,
};
