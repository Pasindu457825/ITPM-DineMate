import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    tables: [{ seats: "", quantity: "" }],
    image: "",
    userId: userId,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${id}`
        );
        
        const restaurantData = {
          ...response.data,
          tables: response.data.tables || [{ seats: "", quantity: "" }],
          cuisine: response.data.cuisine || "",
          openingHours: response.data.openingHours || ""
        };
        
        setFormData(restaurantData);
        setImagePreview(restaurantData.image);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        toast.error("Failed to load restaurant details");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Track form changes
  useEffect(() => {
    if (!loading) {
      setHasChanges(true);
    }
  }, [formData, imageFile]);

  // Form validation
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Restaurant name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!formData.tables.length) {
      newErrors.tables = "At least one table configuration is required";
      isValid = false;
    } else {
      const tableErrors = [];
      formData.tables.forEach((table, index) => {
        const tableError = {};
        if (!table.seats || parseInt(table.seats) <= 0) {
          tableError.seats = "Seats must be greater than 0";
          isValid = false;
        }
        if (!table.quantity || parseInt(table.quantity) <= 0) {
          tableError.quantity = "Quantity must be greater than 0";
          isValid = false;
        }
        if (Object.keys(tableError).length > 0) {
          tableErrors[index] = tableError;
        }
      });
      
      if (tableErrors.length > 0) {
        newErrors.tableErrors = tableErrors;
      }
    }

    setErrors(newErrors);
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
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be smaller than 5MB" });
        return;
      }
      
      setImageFile(file);
      setErrors({ ...errors, image: null });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove table configuration
  const removeTable = (index) => {
    if (formData.tables.length > 1) {
      const updatedTables = formData.tables.filter((_, idx) => idx !== index);
      setFormData({ ...formData, tables: updatedTables });
    } else {
      toast.warning("At least one table configuration is required");
    }
  };

  // Add table configuration
  const addTable = () => {
    setFormData({
      ...formData,
      tables: [...formData.tables, { seats: "", quantity: "" }],
    });
  };

  // Discard changes
  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      navigate("/myRestaurant");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setSubmitLoading(true);
    
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
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }
      
      await axios.put(
        `http://localhost:5000/api/ITPM/restaurants/update-restaurant/${id}`,
        { ...formData, image: imageUrl }
      );
      
      toast.success("Restaurant updated successfully!");
      setTimeout(() => navigate("/myRestaurant"), 1500);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error(error.response?.data?.message || "Failed to update restaurant");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-700">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-purple-900">Update Restaurant</h1>
          <button
            onClick={() => navigate("/display-restaurant")}
            className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to List
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Restaurant Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.phoneNumber ? "border-red-300 bg-red-50" : "border-gray-300"
                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                      )}
                    </div>
                    
                    {/* Location */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.location ? "border-red-300 bg-red-50" : "border-gray-300"
                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Table Configuration Section */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Table Configuration</h3>
                      <button
                        type="button"
                        onClick={addTable}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Table
                      </button>
                    </div>
                    
                    {errors.tables && (
                      <p className="mb-4 text-sm text-red-500">{errors.tables}</p>
                    )}

                    <div className="space-y-3">
                      {formData.tables.map((table, index) => (
                        <div 
                          key={index} 
                          className="flex flex-wrap items-end gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Seats per Table
                            </label>
                            <input
                              type="number"
                              name="seats"
                              value={table.seats}
                              onChange={(e) => handleChange(e, index)}
                              min="1"
                              className={`block w-full px-3 py-2 rounded border ${
                                errors.tableErrors?.[index]?.seats ? "border-red-300" : "border-gray-300"
                              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                            />
                            {errors.tableErrors?.[index]?.seats && (
                              <p className="mt-1 text-xs text-red-500">{errors.tableErrors[index].seats}</p>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Number of Tables
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              value={table.quantity}
                              onChange={(e) => handleChange(e, index)}
                              min="1"
                              className={`block w-full px-3 py-2 rounded border ${
                                errors.tableErrors?.[index]?.quantity ? "border-red-300" : "border-gray-300"
                              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                            />
                            {errors.tableErrors?.[index]?.quantity && (
                              <p className="mt-1 text-xs text-red-500">{errors.tableErrors[index].quantity}</p>
                            )}
                          </div>
                          
                          {formData.tables.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTable(index)}
                              className="px-3 py-2 text-xs text-white bg-red-500 hover:bg-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Section */}
                <div className="md:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Restaurant Image</h3>
                    
                    <div className="aspect-w-1 aspect-h-1 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Restaurant preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Update Image
                    </label>
                    
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-1 text-xs text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    
                    {errors.image && (
                      <p className="mt-2 text-sm text-red-500">{errors.image}</p>
                    )}
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={submitLoading || !hasChanges}
                  className={`px-6 py-2 border border-transparent rounded-lg ${
                    submitLoading || !hasChanges
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  {submitLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    "Update Restaurant"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRestaurant;