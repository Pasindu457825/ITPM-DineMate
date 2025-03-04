const express = require("express");
const router = express.Router();
const foodItemController = require("../../controllers/pamaa/foodItemController"); // Updated path to your controller file

// Add new food item
router.post("/create-food-item", foodItemController.addFoodItem);

// Get one food item by ID using foodId
router.get("/get-food-item/:foodId", foodItemController.getFoodItemByFoodId);

// Get all food items
router.get("/get-all-food-items", foodItemController.getAllFoodItems);

// Update food item by ID using foodId
router.put(
  "/update-food-item/:foodId",
  foodItemController.updateFoodItemByFoodId
);

// Delete food item by ID using foodId
router.delete(
  "/delete-food-item/:foodId",
  foodItemController.deleteFoodItemByFoodId
);

module.exports = router;
