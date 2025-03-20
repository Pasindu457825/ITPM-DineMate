import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";


const CreateRestaurant = () => {
  // Get user ID from localStorage (saved during login)
  const userId = localStorage.getItem("userId");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    tables: [{ seats: "", quantity: "" }],
    image: "",
    userId: userId, // Add the userId to formData
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    // If no userId is found in localStorage, show a warning
    if (!userId) {
      console.warn("No user ID found! Login is required.");
      toast.warning("Please login to add a restaurant");
    }
  }, [userId]);

  // Validation function
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Restaurant name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    if (!formData.description.trim()) {
      tempErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      tempErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    if (!formData.location.trim()) {
      tempErrors.location = "Location is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      isValid = false;
    }


    let tableErrors = [];
    formData.tables.forEach((table, index) => {
      const tableError = {};
      if (!table.seats || table.seats <= 0) {
        tableError.seats = "Seats must be a positive number";
        isValid = false;
      }
      if (!table.quantity || table.quantity <= 0) {
        tableError.quantity = "Quantity must be a positive number";
        isValid = false;
      }
      tableErrors[index] = tableError;
    });

    if (tableErrors.length > 0 && Object.keys(tableErrors[0]).length > 0) {
      tempErrors.tables = tableErrors;
    }

    if (!imageFile && !formData.image) {
      tempErrors.image = "Restaurant image is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Handle form input changes
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    
    if (["seats", "quantity"].includes(name) && index !== undefined) {
      const newTables = [...formData.tables];
      newTables[index][name] = value;
      setFormData({ ...formData, tables: newTables });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Add new table configuration
  const addTable = () => {
    setFormData({
      ...formData,
      tables: [...formData.tables, { seats: "", quantity: "" }],
    });
  };

  // Remove table configuration
  const removeTable = (index) => {
    if (formData.tables.length > 1) {
      const newTables = [...formData.tables];
      newTables.splice(index, 1);
      setFormData({ ...formData, tables: newTables });
    } else {
      toast.error("At least one table configuration is required");
    }
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, image: "Please select an image file" });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, image: "" });
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure userId is included
    if (!formData.userId) {
      setFormData({...formData, userId: userId});
    }
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        const fileName = `restaurantImages/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Error uploading image:", error);
              toast.error("Image upload failed!");
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Include userId in the request payload
      const requestData = { 
        ...formData, 
        image: imageUrl,
        userId: userId // Ensure userId is included
      };
      
      console.log("Sending restaurant data with userId:", requestData.userId);

      const response = await axios.post(
        "http://localhost:5000/api/ITPM/restaurants/create-restaurant",
        requestData
      );
      
      toast.success("Restaurant added successfully!");
      console.log("Restaurant created successfully:", response.data);
      navigate("/myRestaurant");
    } catch (error) {
      console.error("Error creating restaurant:", error.response || error.message);
      toast.error(error.response?.data?.message || "Failed to create restaurant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (<div>
    <ManagerHeader/>
    <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-700 to-indigo-700 px-6 py-8">
            <h2 className="text-3xl font-bold text-white">Create New Restaurant</h2>
            <p className="mt-2 text-blue-100">Fill in the details to add a new restaurant to our platform</p>
            {!userId && (
              <p className="mt-2 text-white bg-red-600 p-2 rounded">
                ⚠️ You are not logged in! Please log in to add restaurants.
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Restaurant Name */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-100">
                  Restaurant Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-700 focus:border-amber-700`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>
  
              {/* Phone Number */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-100">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-700 focus:border-amber-700`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
  
              {/* Location */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-100">
                  Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.location ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-700 focus:border-amber-700`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>
  
              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-100">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-700 focus:border-amber-700`}
                    placeholder="Describe your restaurant"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
  
              {/* Hidden User ID field */}
              <input type="hidden" name="userId" value={userId || ""} />
  
              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-100">
                  Restaurant Image
                </label>
                <div className="mt-1 flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-500 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-300">
                              <label className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-amber-500 hover:text-amber-400 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input 
                                  type="file" 
                                  hidden
                                  accept="image/*" 
                                  onChange={handleFileChange} 
                                  className="sr-only" 
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                            <div 
                              style={{ width: `${uploadProgress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-600"
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-gray-400">
                            Uploading: {Math.round(uploadProgress)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Table Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-100">Table Configuration</h3>
                <button
                  type="button"
                  onClick={addTable}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-700 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Table Type
                </button>
              </div>
              
              {formData.tables.map((table, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-8 gap-4">
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-100">
                        Seats per Table
                      </label>
                      <input
                        type="number"
                        name="seats"
                        value={table.seats}
                        onChange={(e) => handleChange(e, index)}
                        min="1"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.tables?.[index]?.seats ? "border-red-300" : "border-gray-500"
                        } bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-amber-700 focus:border-amber-700`}
                      />
                      {errors.tables?.[index]?.seats && (
                        <p className="mt-1 text-sm text-red-600">{errors.tables[index].seats}</p>
                      )}
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-100">
                        Number of Tables
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={table.quantity}
                        onChange={(e) => handleChange(e, index)}
                        min="1"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.tables?.[index]?.quantity ? "border-red-300" : "border-gray-500"
                        } bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-amber-700 focus:border-amber-700`}
                      />
                      {errors.tables?.[index]?.quantity && (
                        <p className="mt-1 text-sm text-red-600">{errors.tables[index].quantity}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2 flex items-end">
                      {formData.tables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTable(index)}
                          className="mt-1 w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-5">
              <button
                type="button"
                onClick={() => navigate("/myRestaurant")}
                className="bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? "bg-amber-500" : "bg-amber-700 hover:bg-amber-600"
                } py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Create Restaurant"
                )}
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

export default CreateRestaurant;