const express = require("express");
const router = express.Router();
const foodItemController = require("../../controllers/pamaa/foodItemController");

// ✅ Add new food item
router.post("/create-food-item", foodItemController.addFoodItem);

// ✅ Get one food item by ID
router.get("/get-food-item/:id", foodItemController.getFoodItemById);

// ✅ Get all food items
router.get("/get-all-food-items", foodItemController.getAllFoodItems);

// ✅ Update food item by ID (fix function name)
router.put("/update-food-item/:id", foodItemController.updateFoodItem); // ✅ Use correct function name

// ✅ Delete food item by ID (fix function name)
router.delete("/delete-food-item/:id", foodItemController.deleteFoodItem); // ✅ Use correct function name

// ✅ Get all foods for a restaurant
router.get("/restaurant/foods/:restaurantId", foodItemController.getFoodsByRestaurant);

module.exports = router;
