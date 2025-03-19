import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig"; // Ensure correct path to firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UpdateFoodForm = () => {
  const { id } = useParams(); // Retrieve the food item's ID from the URL parameters
  const navigate = useNavigate();

  // State variables for managing food item details
  const [food, setFood] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: "Available",
    image: "", // URL of the current food item image
    restaurantId: ""
  });

  const [newImage, setNewImage] = useState(null); // State for holding a new image file if updated
  const [uploadProgress, setUploadProgress] = useState(0); // State to track the progress of image upload
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(""); // State to store any error messages
  const [previewURL, setPreviewURL] = useState(""); // State for image preview

  // Validation states
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  // Fetch existing food item details when the component mounts or the ID changes
  useEffect(() => {
    if (!id) {
      setError("Invalid food ID.");
      setLoading(false);
      return;
    }

    const fetchFood = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/foodItems/get-food-item/${id}`
        );
        
        // Convert boolean availability to string if needed
        const foodData = response.data;
        if (typeof foodData.availability === 'boolean') {
          foodData.availability = foodData.availability ? "Available" : "Unavailable";
        }
        
        setFood(foodData); // Set fetched food item data to state
        setPreviewURL(foodData.image); // Set current image URL as preview
      } catch (err) {
        setError("Error fetching food details.");
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching data
      }
    };

    fetchFood();
  }, [id]);

  // Create preview URL for new image
  useEffect(() => {
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage);
      setPreviewURL(objectUrl);
      
      // Free memory when this component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [newImage]);

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value }); // Update corresponding field in food object
    
    // Clear validation error for the changed field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Function to handle file selection for new image
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]); // Set new image file to state
    }
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};
    
    // Validate name (max 20 chars)
    if (food.name.length > 20) {
      newErrors.name = "Food name must be 20 characters or less";
      isValid = false;
    } else if (food.name.trim() === "") {
      newErrors.name = "Food name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }
    
    // Validate description (max 75 chars)
    if (food.description.length > 75) {
      newErrors.description = "Description must be 75 characters or less";
      isValid = false;
    } else if (food.description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    } else {
      newErrors.description = "";
    }
    
    // Validate price (positive number)
    if (parseFloat(food.price) <= 0) {
      newErrors.price = "Price must be a positive number";
      isValid = false;
    } else if (food.price === "") {
      newErrors.price = "Price is required";
      isValid = false;
    } else {
      newErrors.price = "";
    }
    
    // Validate category
    if (!food.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    } else {
      newErrors.category = "";
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Function to handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");

    if (newImage) {
      const fileName = `foodImages/${Date.now()}_${newImage.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, newImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update upload progress
        },
        (error) => {
          console.error("Error uploading new image:", error);
          setLoading(false);
          setError("Failed to upload new image.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const updatedFood = { ...food, image: downloadURL };
          submitUpdate(updatedFood); // Submit updated food item data
        }
      );
    } else {
      submitUpdate(food); // Submit update if no new image is selected
    }
  };

  // Function to submit the food item update
  const submitUpdate = async (updatedFood) => {
    try {
      await axios.put(
        `http://localhost:5000/api/ITPM/foodItems/update-food-item/${id}`,
        updatedFood
      );
      console.log("Food item updated successfully");
      navigate(`/restaurant/foods/${food.restaurantId}`); // Navigate to food list after update
    } catch (err) {
      console.error("Error updating food item:", err);
      setError("Failed to update food item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !food.name) {
    return (
      <div className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="bg-blue-gray-900 p-8 rounded-lg shadow-lg text-white">
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-center mt-4">Loading food details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-blue-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-5">
          <h2 className="text-3xl font-bold text-white mb-1">
            Update Food Item
          </h2>
          <p className="text-amber-200 text-sm">Modify the details of your food item</p>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-100">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          {/* Food Item Name */}
          <div className="space-y-1">
            <label className="block text-amber-300 text-sm font-medium">Food Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter food name (max 20 chars)"
              value={food.name}
              onChange={handleChange}
              className={`p-3 bg-blue-gray-800 border rounded-md w-full text-white placeholder-blue-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition ${
                errors.name ? "border-red-500" : "border-blue-gray-600"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-amber-300 text-sm font-medium">Description</label>
            <textarea
              name="description"
              placeholder="Describe your food item (max 75 chars)"
              value={food.description}
              onChange={handleChange}
              className={`p-3 bg-blue-gray-800 border rounded-md w-full text-white placeholder-blue-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition min-h-[100px] ${
                errors.description ? "border-red-500" : "border-blue-gray-600"
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            <p className="text-blue-gray-400 text-xs text-right">{food.description.length}/75 characters</p>
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-amber-300 text-sm font-medium">Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">$</span>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={food.price}
                  onChange={handleChange}
                  className={`p-3 pl-8 bg-blue-gray-800 border rounded-md w-full text-white placeholder-blue-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition ${
                    errors.price ? "border-red-500" : "border-blue-gray-600"
                  }`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-amber-300 text-sm font-medium">Category</label>
              <select
                name="category"
                value={food.category}
                onChange={handleChange}
                className={`p-3 bg-blue-gray-800 border rounded-md w-full text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition appearance-none ${
                  errors.category ? "border-red-500" : "border-blue-gray-600"
                }`}
              >
                <option value="" disabled>Select Category</option>
                <option value="salad">Salad</option>
                <option value="rolls">Rolls</option>
                <option value="desserts">Desserts</option>
                <option value="sandwich">Sandwich</option>
                <option value="cake">Cake</option>
                <option value="pure veg">Pure Veg</option>
                <option value="pasta">Pasta</option>
                <option value="noodles">Noodles</option>
                <option value="beverages">Beverages</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={food.availability === "Available"}
                onChange={(e) => {
                  setFood({
                    ...food,
                    availability: e.target.checked ? "Available" : "Unavailable"
                  });
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-blue-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-700"></div>
              <span className="ml-3 text-sm font-medium text-white">
                {food.availability === "Available" ? "Available" : "Unavailable"}
              </span>
            </label>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-amber-300 text-sm font-medium">Food Image</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center border-blue-gray-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="food-image"
              />
              {previewURL ? (
                <div className="relative">
                  <img 
                    src={previewURL} 
                    alt="Food preview" 
                    className="h-40 mx-auto object-contain rounded" 
                  />
                  <label 
                    htmlFor="food-image" 
                    className="absolute bottom-0 right-0 bg-amber-700 text-white rounded-full p-2 cursor-pointer shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                </div>
              ) : (
                <label htmlFor="food-image" className="cursor-pointer flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-gray-700 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-amber-300">Click to upload image</span>
                  <span className="text-blue-gray-400 text-xs mt-1">JPG, PNG or GIF</span>
                </label>
              )}
              {uploadProgress > 0 && (
                <div className="w-full bg-blue-gray-700 rounded-full h-2.5 mt-3">
                  <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
              <label htmlFor="food-image" className="mt-3 text-amber-500 hover:text-amber-400 cursor-pointer text-sm inline-block">
                {previewURL ? "Change image" : ""}
              </label>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className={`py-3 px-6 rounded-md w-full text-white font-medium transition-colors ${
                loading 
                  ? "bg-blue-gray-600 cursor-not-allowed" 
                  : "bg-amber-700 hover:bg-amber-600"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Food Item"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/restaurant/foods/${food.restaurantId}`)}
              className="py-3 px-6 bg-blue-gray-700 hover:bg-blue-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFoodForm;