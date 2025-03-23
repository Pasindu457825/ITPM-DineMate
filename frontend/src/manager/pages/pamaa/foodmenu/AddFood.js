import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFoodForm = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  // State variables for food item details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("Available");
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
      toast.info("Image selected successfully!");
    }
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};
    
    // Validate name (max 20 chars)
    if (name.length > 20) {
      newErrors.name = "Food name must be 20 characters or less";
      toast.error("Food name is too long!");
      isValid = false;
    } else if (name.trim() === "") {
      newErrors.name = "Food name is required";
      toast.error("Food name is required!");
      isValid = false;
    } else {
      newErrors.name = "";
    }
    
    // Validate description (max 75 chars)
    if (description.length > 75) {
      newErrors.description = "Description must be 75 characters or less";
      toast.error("Description is too long!");
      isValid = false;
    } else if (description.trim() === "") {
      newErrors.description = "Description is required";
      toast.error("Description is required!");
      isValid = false;
    } else {
      newErrors.description = "";
    }
    
    // Validate price (positive number)
    if (parseFloat(price) <= 0) {
      newErrors.price = "Price must be a positive number";
      toast.error("Price must be positive!");
      isValid = false;
    } else if (price.trim() === "") {
      newErrors.price = "Price is required";
      toast.error("Price is required!");
      isValid = false;
    } else {
      newErrors.price = "";
    }
    
    // Validate category
    if (!category) {
      newErrors.category = "Please select a category";
      toast.error("Please select a category!");
      isValid = false;
    } else {
      newErrors.category = "";
    }
    
    // Validate image
    if (!imageFile) {
      newErrors.imageFile = "Please select an image";
      toast.error("Please select an image!");
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
    toast.info("Uploading your food item...");

    try {
      // Generate a unique filename
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
          toast.error("Image upload failed!");
          setLoading(false);
        },
        async () => {
          // Get image URL after upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully! URL:", downloadURL);
          toast.success("Image uploaded successfully!");

          // Food item data with image URL
          const foodData = {
            name,
            description,
            price: parseFloat(price) || 0,
            category,
            availability, 
            restaurantId,
            image: downloadURL,
          };

          try {
            const response = await axios.post(
              "http://localhost:5000/api/ITPM/foodItems/create-food-item",
              foodData
            );
          
            toast.success("Food item added successfully!");
            setTimeout(() => {
              navigate(`/restaurant/foods/${restaurantId}`);
            }, 1500);
          } catch (error) {
            console.error("Error adding food item:", error);
            toast.error("Failed to add food item!");
          } finally {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#E9E4E4] min-h-screen">
      <ManagerHeader />
      <br/>
      <br/><br/>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-[#276265] p-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Add New Food Item
            </h2>
            <p className="text-white text-opacity-90 text-sm">
              Complete the form below to add a delicious new item to your menu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Food Item Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Food Name</label>
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
                className={`p-3 bg-white border rounded-lg w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#276265] focus:border-[#276265] outline-none transition ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              <p className="text-gray-500 text-xs text-right">{name.length}/20 characters</p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Describe your food item (max 75 chars)"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.length <= 75) {
                    setErrors({...errors, description: ""});
                  }
                }}
                className={`p-3 bg-white border rounded-lg w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#276265] focus:border-[#276265] outline-none transition min-h-[100px] ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-xs text-right">{description.length}/75 characters</p>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rs  </span>
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
                    className={`p-3 pl-8 bg-white border rounded-lg w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#276265] focus:border-[#276265] outline-none transition ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setErrors({...errors, category: ""});
                  }}
                  className={`p-3 bg-white border rounded-lg w-full text-gray-700 focus:ring-2 focus:ring-[#276265] focus:border-[#276265] outline-none transition ${
                    errors.category ? "border-red-500" : "border-gray-300"
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
                  onChange={(e) => {
                    const newAvailability = e.target.checked ? "Available" : "Unavailable";
                    setAvailability(newAvailability);
                    toast.info(`Item set to ${newAvailability}`);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#276265]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#276265]"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {availability === "Available" ? "Available" : "Unavailable"}
                </span>
              </label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Food Image</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.imageFile ? "border-red-500" : "border-gray-300 hover:border-[#276265]"
              } transition-colors bg-gray-50`}>
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
                      className="h-48 mx-auto object-contain rounded-lg shadow-sm" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreviewURL("");
                        toast.info("Image removed");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label htmlFor="food-image" className="cursor-pointer flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-[#276265]/20 flex items-center justify-center mb-3 text-[#276265]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[#276265] font-medium">Click to upload image</span>
                    <span className="text-gray-500 text-xs mt-1">JPG, PNG or GIF</span>
                  </label>
                )}
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-[#276265] h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    <p className="text-xs text-gray-600 mt-1">{Math.round(uploadProgress)}% uploaded</p>
                  </div>
                )}
                <label htmlFor="food-image" className={`${previewURL ? "mt-4" : ""} text-[#276265] hover:text-[#276265]/80 cursor-pointer text-sm inline-block transition-colors`}>
                  {previewURL ? "Change image" : ""}
                </label>
              </div>
              {errors.imageFile && <p className="text-red-600 text-xs">{errors.imageFile}</p>}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`py-3 px-6 rounded-lg w-full text-white font-medium transition-colors shadow-md ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#262B3E] hover:bg-[#262B3E]/90"
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
                onClick={() => {
                  toast.info("Operation cancelled");
                  setTimeout(() => {
                    navigate(`/restaurant/foods/${restaurantId}`);
                  }, 1000);
                }}
                className="py-3 px-6 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ManagerFooter />
    </div>
  );
};

export default AddFoodForm;