const express = require("express");
const router = express.Router();
const foodItemController = require("../../controllers/pamaa/foodItemController");

//  Add new food item
router.post("/create-food-item", foodItemController.addFoodItem);

//  Get one food item by ID
router.get("/get-food-item/:id", foodItemController.getFoodItemById);

//  Get all food items
router.get("/get-all-food-items", foodItemController.getAllFoodItems);

//  Update food item by ID 
router.put("/update-food-item/:id", foodItemController.updateFoodItem);

//  Delete food item by ID
router.delete("/delete-food-item/:id", foodItemController.deleteFoodItem);

//  Get all foods for a restaurant
router.get("/restaurant/foods/:restaurantId", foodItemController.getFoodsByRestaurant);

// Toggle availability of a food item
router.patch("/toggle-availability/:id", foodItemController.toggleFoodItemAvailability);

module.exports = router;
