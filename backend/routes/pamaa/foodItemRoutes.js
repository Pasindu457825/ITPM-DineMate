const express = require("express");
const router = express.Router();
const foodItemController = require("../../controllers/pamaa/foodItemController");

// Add new food item
router.post("/create-food-item/restaurantId", foodItemController.addFoodItem);

// Get one food item by ID using foodId
router.get("/get-food-item/:foodId", foodItemController.getFoodItemById);

// Get all food items
router.get("/get-all-food-items", foodItemController.getAllFoodItems);

// Update food item by ID using foodId
router.put("/update-food-item/:foodId", foodItemController.updateFoodItemById);

// Delete food item by ID using foodId
router.delete(
  "/delete-food-item/:foodId",
  foodItemController.deleteFoodItemById
);

module.exports = router;
