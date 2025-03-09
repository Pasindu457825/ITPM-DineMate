const express = require("express");
const router = express.Router();
const foodItemController = require("../../controllers/pamaa/foodItemController");

// Add new food item
router.post("/create-food-item", foodItemController.addFoodItem);

// Get one food item by ID
router.get("/get-food-item/:id", foodItemController.getFoodItemById);

// Get all food items
router.get("/get-all-food-items", foodItemController.getAllFoodItems);

// Update food item by ID
router.put("/update-food-item/:id", foodItemController.updateFoodItemById);

// Delete food item by ID
router.delete("/delete-food-item/:id", foodItemController.deleteFoodItemById);

module.exports = router;
