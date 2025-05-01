import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    image360: "", // NEW
    userId: userId,
  });

  const [image360File, setImage360File] = useState(null);
  const [image360Preview, setImage360Preview] = useState(null);

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!userId) {
      toast.warning("Please login to add a restaurant", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [userId]);

  // Enhanced validation function
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Restaurant name validation
    if (!formData.name.trim()) {
      tempErrors.name = "Restaurant name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
      isValid = false;
    } else if (formData.name.length > 50) {
      tempErrors.name = "Name must be less than 50 characters";
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      tempErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      tempErrors.description = "Description must be at least 10 characters";
      isValid = false;
    } else if (formData.description.length > 500) {
      tempErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    // Location validation
    if (!formData.location.trim()) {
      tempErrors.location = "Location is required";
      isValid = false;
    } else if (formData.location.length < 5) {
      tempErrors.location = "Please enter a more specific location";
      isValid = false;
    }

    // 360° Image validation
    if (!image360File && !formData.image360) {
      tempErrors.image360 = "360° view image is required";
      isValid = false;
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^(077|076|078|075|011)\d{7}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber =
        "Please enter a valid 10-digit phone number starting with 077, 076, 078, 075, or 011";
      isValid = false;
    }

    // Table validation
    let tableErrors = [];
    formData.tables.forEach((table, index) => {
      const tableError = {};
      if (!table.seats || isNaN(table.seats) || parseInt(table.seats) <= 0) {
        tableError.seats = "Seats must be a positive number";
        isValid = false;
      } else if (parseInt(table.seats) > 10) {
        tableError.seats = "Maximum 10 seats per table allowed";
        isValid = false;
      }

      if (
        !table.quantity ||
        isNaN(table.quantity) ||
        parseInt(table.quantity) <= 0
      ) {
        tableError.quantity = "Quantity must be a positive number";
        isValid = false;
      } else if (parseInt(table.quantity) > 10) {
        tableError.quantity = "Maximum 10 tables of one type allowed";
        isValid = false;
      }

      if (Object.keys(tableError).length > 0) {
        tableErrors[index] = tableError;
      }
    });

    if (
      tableErrors.length > 0 &&
      Object.values(tableErrors).some((error) => Object.keys(error).length > 0)
    ) {
      tempErrors.tables = tableErrors;
    }

    // Image validation
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
      toast.error("At least one table configuration is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle image selection with enhanced validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match("image.*")) {
        setErrors({ ...errors, image: "Please select an image file" });
        toast.error("Invalid file type. Please select an image.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
        });
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

      toast.info("Image selected successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleImage360Upload = (file) => {
    if (!file.type.match("image.*")) {
      setErrors({ ...errors, image360: "Please select an image file" });
      toast.error("Invalid file type for 360° image", { autoClose: 3000 });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image360: "360° image size must be under 5MB" });
      toast.error("360° image too large (max 5MB)", { autoClose: 3000 });
      return;
    }

    setImage360File(file);
    setErrors({ ...errors, image360: "" });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage360Preview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.match("image.*")) {
      if (file.size <= 5 * 1024 * 1024) {
        setImageFile(file);
        setErrors({ ...errors, image: "" });

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        toast.info("Image uploaded successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      setErrors({ ...errors, image: "Please select an image file" });
      toast.error("Invalid file type. Please select an image.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle form submission with enhanced error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check for userId
    if (!userId) {
      toast.error("You must be logged in to create a restaurant", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    let imageUrl = formData.image;
    let image360Url = formData.image360;

    if (image360File) {
      const fileName360 = `restaurantImages/360_${Date.now()}_${
        image360File.name
      }`;
      const storageRef360 = ref(storage, fileName360);
      const uploadTask360 = uploadBytesResumable(storageRef360, image360File);

      toast.info("Uploading 360° view image...");

      await new Promise((resolve, reject) => {
        uploadTask360.on(
          "state_changed",
          null,
          (error) => {
            console.error("Error uploading 360 image:", error);
            toast.dismiss();
            toast.error("360° image upload failed.");
            reject(error);
          },
          async () => {
            image360Url = await getDownloadURL(uploadTask360.snapshot.ref); // ✅ assign to local variable
            toast.success("360° image uploaded successfully!");
            resolve();
          }
        );
      });
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const fileName = `restaurantImages/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        toast.info("Uploading image...", {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Error uploading image:", error);
              toast.dismiss();
              toast.error("Image upload failed. Please try again.", {
                position: "top-right",
                autoClose: 4000,
              });
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              toast.dismiss();
              toast.success("Image uploaded successfully!", {
                position: "top-right",
                autoClose: 2000,
              });
              resolve();
            }
          );
        });
      }

      // Include userId in the request payload
      const requestData = {
        ...formData,
        image: imageUrl,
        image360: image360Url, // ✅ add this
        userId: userId,
      };

      toast.info("Creating restaurant...", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      });

      const response = await axios.post(
        "http://localhost:5000/api/ITPM/restaurants/create-restaurant",
        requestData
      );

      toast.dismiss();
      toast.success("Restaurant added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Wait briefly to let the user see the success message
      setTimeout(() => {
        navigate("/myRestaurant");
      }, 2000);
    } catch (error) {
      console.error(
        "Error creating restaurant:",
        error.response || error.message
      );
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          "Failed to create restaurant. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ManagerHeader />
      <br />
      <br />
      <ToastContainer />
      <div className="min-h-screen bg-[#E9E4E4] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] px-6 py-8">
              <h2 className="text-3xl font-bold text-white">
                Create New Restaurant
              </h2>
              <p className="mt-2 text-gray-200">
                Fill in the details to add a new restaurant to our platform
              </p>
              {!userId && (
                <div className="mt-4 px-4 py-3 rounded-md bg-red-100 border-l-4 border-red-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        You are not logged in! Please log in to add restaurants.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-white">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Restaurant Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter restaurant name"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.name
                          ? "border-red-300 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2C3E50] focus:border-[#2C3E50]`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phoneNumber
                          ? "border-red-300 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2C3E50] focus:border-[#2C3E50]`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Full restaurant address"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.location
                          ? "border-red-300 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2C3E50] focus:border-[#2C3E50]`}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe your restaurant: cuisine type, specialties, atmosphere, etc."
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.description
                          ? "border-red-300 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2C3E50] focus:border-[#2C3E50]`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.description.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Hidden User ID field */}
                <input type="hidden" name="userId" value={userId || ""} />

                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Restaurant Image
                  </label>
                  <div className="mt-1">
                    <div
                      className={`flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
                        errors.image
                          ? "border-red-300 border-dashed"
                          : "border-gray-300 border-dashed"
                      } rounded-md bg-gray-50 hover:bg-gray-100 transition duration-150`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-48 w-full object-cover rounded-md shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                                setErrors({ ...errors, image: "" });
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 transition-colors rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg"
                              aria-label="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600 justify-center">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#2C3E50] hover:text-[#34495E] focus-within:outline-none">
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
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.image}
                      </p>
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${uploadProgress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#2C3E50] transition-all duration-300"
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-gray-500 flex justify-between">
                            <span>
                              Uploading: {Math.round(uploadProgress)}%
                            </span>
                            <span>{Math.round(uploadProgress)}% Complete</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* 360° View Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    360° View Image
                  </label>
                  <div className="mt-1">
                    <div
                      className={`flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
                        errors.image360
                          ? "border-red-300 border-dashed"
                          : "border-gray-300 border-dashed"
                      } rounded-md bg-gray-50 hover:bg-gray-100 transition duration-150`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        handleImage360Upload(file);
                      }}
                    >
                      <div className="space-y-1 text-center">
                        {image360Preview ? (
                          <div className="relative">
                            <img
                              src={image360Preview}
                              alt="360 Preview"
                              className="h-48 w-full object-cover rounded-md shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImage360File(null);
                                setImage360Preview(null);
                                setErrors({ ...errors, image360: "" });
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white"
                              aria-label="Remove 360 image"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600 justify-center">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#2C3E50] hover:text-[#34495E] focus-within:outline-none">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImage360Upload(e.target.files[0])
                                  }
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.image360 && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.image360}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="space-y-4 mt-8">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Table Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addTable}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#2C3E50] hover:bg-[#34495E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C3E50] shadow-sm transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Table Type
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.tables.map((table, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 bg-[#E9E4E4] px-2 py-1 rounded-md">
                          Table Type {index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-8 gap-4">
                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Seats per Table
                          </label>
                          <input
                            type="number"
                            name="seats"
                            value={table.seats}
                            onChange={(e) => handleChange(e, index)}
                            min="1"
                            placeholder="Number of seats"
                            className={`mt-1 block w-full px-3 py-2 border ${
                              errors.tables?.[index]?.seats
                                ? "border-red-300 ring-1 ring-red-500"
                                : "border-gray-300"
                            } bg-white text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#2C3E50] focus:border-[#2C3E50]`}
                          />
                          {errors.tables?.[index]?.seats && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.tables[index].seats}
                            </p>
                          )}
                        </div>

                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Number of Tables
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={table.quantity}
                            onChange={(e) => handleChange(e, index)}
                            min="1"
                            placeholder="Available quantity"
                            className={`mt-1 block w-full px-3 py-2 border ${
                              errors.tables?.[index]?.quantity
                                ? "border-red-300 ring-1 ring-red-500"
                                : "border-gray-300"
                            } bg-white text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#2C3E50] focus:border-[#2C3E50]`}
                          />
                          {errors.tables?.[index]?.quantity && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.tables[index].quantity}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2 flex items-end">
                          {formData.tables.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTable(index)}
                              className="mt-1 w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/myRestaurant")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C3E50] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "bg-[#34495E] cursor-not-allowed"
                      : "bg-[#2C3E50] hover:bg-[#34495E]"
                  } py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C3E50] transition-colors`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
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
      <ManagerFooter />
    </div>
  );
};

export default CreateRestaurant;
