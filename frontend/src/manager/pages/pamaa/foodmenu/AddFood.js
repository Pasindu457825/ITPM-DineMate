import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig"; // Ensure correct path
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";


const AddFoodForm = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  

  // State variables for food item details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("Available"); //  Ensure it's a string
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState("");
  
  // Validation states
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageFile: ""
  });

  // Preview the selected image
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewURL(objectUrl);
      
      // Free memory when this component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setErrors({...errors, imageFile: ""});
    }
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};
    
    // Validate name (max 20 chars)
    if (name.length > 20) {
      newErrors.name = "Food name must be 20 characters or less";
      isValid = false;
    } else if (name.trim() === "") {
      newErrors.name = "Food name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }
    
    // Validate description (max 50 chars)
    if (description.length > 75) {
      newErrors.description = "Description must be 50 characters or less";
      isValid = false;
    } else if (description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    } else {
      newErrors.description = "";
    }
    
    // Validate price (positive number)
    if (parseFloat(price) <= 0) {
      newErrors.price = "Price must be a positive number";
      isValid = false;
    } else if (price.trim() === "") {
      newErrors.price = "Price is required";
      isValid = false;
    } else {
      newErrors.price = "";
    }
    
    // Validate category
    if (!category) {
      newErrors.category = "Please select a category";
      isValid = false;
    } else {
      newErrors.category = "";
    }
    
    // Validate image
    if (!imageFile) {
      newErrors.imageFile = "Please select an image";
      isValid = false;
    } else {
      newErrors.imageFile = "";
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      //  Generate a unique filename
      const fileName = `foodImages/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
          alert("Image upload failed!");
          setLoading(false);
        },
        async () => {
          //  Get image URL after upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully! URL:", downloadURL);

          //  Ensure price is a number
          const itemPrice = parseFloat(price) || 0;

          // Food item data with image URL
          const foodData = {
            name,
            description,
            price: parseFloat(price) || 0,
            category,
            availability, //  Now always a string
            restaurantId,
            image: downloadURL,
          };

          try {
            const response = await axios.post(
              "http://localhost:5000/api/ITPM/foodItems/create-food-item",
              foodData
            );
          
            alert("Food item added successfully!");
            navigate(`/restaurant/foods/${restaurantId}`);  // Corrected the navigation path
          } catch (error) {
            console.error("Error adding food item:", error);
            alert("Failed to add food item!");
          } finally {
            setLoading(false);
          }
          
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div>
      <ManagerHeader/>
    <div>
      <div className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-700 to-indigo-700 p-5">
            <h2 className="text-3xl font-bold text-white mb-1">
              Add New Food Item
            </h2>
            <p className="text-blue-100 text-sm">Complete the form below to add a delicious new item to your menu</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Food Item Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-100">Food Name</label>
              <input
                type="text"
                placeholder="Enter food name (max 20 chars)"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.length <= 20) {
                    setErrors({...errors, name: ""});
                  }
                }}
                className={`p-3 bg-gray-800 border rounded-md w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition ${
                  errors.name ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-100">Description</label>
              <textarea
                placeholder="Describe your food item (max 50 chars)"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.length <= 50) {
                    setErrors({...errors, description: ""});
                  }
                }}
                className={`p-3 bg-gray-800 border rounded-md w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition min-h-[100px] ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
              <p className="text-gray-400 text-xs text-right">{description.length}/50 characters</p>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-100">Price</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPrice(value);
                      if (parseFloat(value) > 0) {
                        setErrors({...errors, price: ""});
                      }
                    }}
                    className={`p-3 pl-8 bg-gray-800 border rounded-md w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition ${
                      errors.price ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                </div>
                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-100">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setErrors({...errors, category: ""});
                  }}
                  className={`p-3 bg-gray-800 border rounded-md w-full text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition appearance-none ${
                    errors.category ? "border-red-500" : "border-gray-600"
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
                {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability === "Available"}
                  onChange={(e) =>
                    setAvailability(e.target.checked ? "Available" : "Unavailable")
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-700"></div>
                <span className="ml-3 text-sm font-medium text-white">
                  {availability === "Available" ? "Available" : "Unavailable"}
                </span>
              </label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-100">Food Image</label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                errors.imageFile ? "border-red-500" : "border-gray-500"
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreviewURL("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label htmlFor="food-image" className="cursor-pointer flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-blue-300">Click to upload image</span>
                    <span className="text-gray-400 text-xs mt-1">JPG, PNG or GIF</span>
                  </label>
                )}
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                <label htmlFor="food-image" className={`${previewURL ? "mt-3" : ""} text-amber-500 hover:text-amber-400 cursor-pointer text-sm inline-block`}>
                  {previewURL ? "Change image" : ""}
                </label>
              </div>
              {errors.imageFile && <p className="text-red-600 text-xs">{errors.imageFile}</p>}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className={`py-3 px-6 rounded-md w-full text-white font-medium transition-colors ${
                  loading 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-amber-700 hover:bg-amber-600"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Add Food Item"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/restaurant/foods/${restaurantId}`)}
                className="py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <ManagerFooter/>
    </div>

  );
};

export default AddFoodForm;