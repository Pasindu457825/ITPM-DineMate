import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";

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
    image360: "", // NEW
    userId: userId,
  });

  const [image360File, setImage360File] = useState(null);
  const [image360Preview, setImage360Preview] = useState(null);
  const [uploadProgress360, setUploadProgress360] = useState(0);

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
          openingHours: response.data.openingHours || "",
          image360: response.data.image360 || "", // ✅ add this line
        };

        setFormData(restaurantData);
        setImagePreview(restaurantData.image);

        if (restaurantData.image360) {
          setImage360Preview(restaurantData.image360); // ✅ set preview for 360 image
        }

        setLoading(false);
        toast.success("Restaurant details loaded successfully");
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
    let toastShown = false;

    if (!formData.name.trim()) {
      newErrors.name = "Restaurant name is required";
      if (!toastShown) {
        toast.error("Restaurant name is required");
        toastShown = true;
      }
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      if (!toastShown) {
        toast.error("Description is required");
        toastShown = true;
      }
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      if (!toastShown) {
        toast.error("Location is required");
        toastShown = true;
      }
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      if (!toastShown) {
        toast.error("Phone number is required");
        toastShown = true;
      }
      isValid = false;
    } else if (!/^(077|076|078|075|011)\d{7}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid 10-digit phone number starting with 077, 076, 078, 075, or 011";
      if (!toastShown) {
        toast.error("Please enter a valid phone number format");
        toastShown = true;
      }
      isValid = false;
    }

    if (!formData.tables.length) {
      newErrors.tables = "At least one table configuration is required";
      if (!toastShown) {
        toast.error("At least one table configuration is required");
        toastShown = true;
      }
      isValid = false;
    } else {
      const tableErrors = [];
      formData.tables.forEach((table, index) => {
        const tableError = {};
        if (!table.seats || parseInt(table.seats) <= 0) {
          tableError.seats = "Seats must be greater than 0";
          if (!toastShown) {
            toast.error(`Table ${index + 1}: Seats must be greater than 0`);
            toastShown = true;
          }
          isValid = false;
        }
        if (!table.quantity || parseInt(table.quantity) <= 0) {
          tableError.quantity = "Quantity must be greater than 0";
          if (!toastShown) {
            toast.error(`Table ${index + 1}: Quantity must be greater than 0`);
            toastShown = true;
          }
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

    if (!isValid && !toastShown) {
      toast.error("Please fix all errors before submitting");
    } else if (isValid) {
      toast.info("Form validation successful");
    }

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
      toast.info(`Updating ${name.charAt(0).toUpperCase() + name.slice(1)}`);
    }
  };

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.match("image.*")) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be smaller than 5MB" });
        toast.error("Image must be smaller than 5MB");
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, image: null });
      toast.info("Image selected successfully");

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
      toast.info("Table configuration removed");
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
    toast.info("New table configuration added");
  };

  // Discard changes
  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      toast.info("Changes discarded");
      navigate("/myRestaurant");
    }
  };

  const handleImage360Upload = (file) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select a valid 360° image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("360° image must be smaller than 5MB");
      return;
    }

    setImage360File(file);
    const reader = new FileReader();
    reader.onloadend = () => setImage360Preview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting");
      return;
    }

    let image360Url = formData.image360;

    if (image360File) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image360File); // converts to base64
      });
      image360Url = base64; // assign base64 to send to MongoDB
    }

    setSubmitLoading(true);
    toast.info("Updating restaurant information...");

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
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              if (progress === 25) {
                toast.info("Image upload 25% complete");
              } else if (progress === 50) {
                toast.info("Image upload 50% complete");
              } else if (progress === 75) {
                toast.info("Image upload 75% complete");
              }
            },
            (error) => {
              console.error("Error uploading image:", error);
              toast.error("Error uploading image");
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              toast.success("Image uploaded successfully");
              resolve();
            }
          );
        });
      }
      const userId = localStorage.getItem("userId");
      await axios.put(
        `http://localhost:5000/api/ITPM/restaurants/update-restaurant/${id}`,
        { ...formData, image: imageUrl, image360: image360Url, userId }
      );

      toast.success("Restaurant updated successfully!");
      setTimeout(() => navigate("/myRestaurant"), 1500);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error(
        error.response?.data?.message || "Failed to update restaurant"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E9E4E4]">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D5A73]"></div>
          <p className="mt-4 text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ManagerHeader />
      <br />
      <br />
      <div className="min-h-screen bg-[#E9E4E4] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Update Restaurant
            </h1>
            <button
              onClick={() => {
                toast.info("Returning to restaurant list");
                navigate("/myrestaurant");
              }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#3D5A73] border border-gray-300 rounded-md hover:bg-[#2D4A63] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to List
            </button>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden">
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
                            errors.name
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          } focus:ring-2 focus:ring-[#3D5A73] focus:border-transparent`}
                          onFocus={() => toast.info("Editing restaurant name")}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name}
                          </p>
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
                            errors.phoneNumber
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          } focus:ring-2 focus:ring-[#3D5A73] focus:border-transparent`}
                          onFocus={() =>
                            toast.info(
                              "Editing phone number - Format: 07XXXXXXXX or 011XXXXXXX"
                            )
                          }
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.phoneNumber}
                          </p>
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
                            errors.location
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          } focus:ring-2 focus:ring-[#3D5A73] focus:border-transparent`}
                          onFocus={() =>
                            toast.info("Editing restaurant location")
                          }
                        />
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.location}
                          </p>
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
                            errors.description
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          } focus:ring-2 focus:ring-[#3D5A73] focus:border-transparent`}
                          onFocus={() =>
                            toast.info("Editing restaurant description")
                          }
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Table Configuration Section */}
                    <div className="bg-[#F5F2F2] p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-700">
                          Table Configuration
                        </h3>
                        <button
                          type="button"
                          onClick={addTable}
                          className="inline-flex items-center px-3 py-1.5 bg-[#3D5A73] text-white text-sm font-medium rounded-full hover:bg-[#2D4A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D5A73] transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add Table
                        </button>
                      </div>

                      {errors.tables && (
                        <p className="mb-4 text-sm text-red-500">
                          {errors.tables}
                        </p>
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
                                  errors.tableErrors?.[index]?.seats
                                    ? "border-red-300"
                                    : "border-gray-200"
                                } focus:ring-2 focus:ring-[#3D5A73] focus:border-transparent`}
                                onFocus={() =>
                                  toast.info(
                                    `Editing seats for table configuration ${
                                      index + 1
                                    }`
                                  )
                                }
                              />
                              {errors.tableErrors?.[index]?.seats && (
                                <p className="mt-1 text-xs text-red-500">
                                  {errors.tableErrors[index].seats}
                                </p>
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
                                  errors.tableErrors?.[index]?.quantity
                                    ? "border-red-300"
                                    : "border-gray-200"
                                } focus:ring-2 focus:ring-[#3D5A73] focus:border-transparent`}
                                onFocus={() =>
                                  toast.info(
                                    `Editing quantity for table configuration ${
                                      index + 1
                                    }`
                                  )
                                }
                              />
                              {errors.tableErrors?.[index]?.quantity && (
                                <p className="mt-1 text-xs text-red-500">
                                  {errors.tableErrors[index].quantity}
                                </p>
                              )}
                            </div>

                            {formData.tables.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTable(index)}
                                className="px-3 py-2 text-xs text-white bg-red-500 hover:bg-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
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
                    <div className="bg-[#F5F2F2] p-4 rounded-lg border border-gray-200 h-full">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">
                        Restaurant Image
                      </h3>

                      <div className="aspect-w-1 aspect-h-1 mb-4 bg-white rounded-lg overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Restaurant preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg
                              className="h-16 w-16 text-gray-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Update Image
                      </label>

                      <div className="flex items-center justify-center w-full">
                        <label
                          className="flex flex-col w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            toast.info("Select a new restaurant image")
                          }
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-2 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="mb-1 text-xs text-gray-500">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 5MB
                            </p>
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
                        <p className="mt-2 text-sm text-red-500">
                          {errors.image}
                        </p>
                      )}

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-[#3D5A73] h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploading: {Math.round(uploadProgress)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 360° View Image Upload */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      360° View Image
                    </h3>
                    {image360Preview ? (
                      <img
                        src={image360Preview}
                        alt="360 Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-2">
                        <span className="text-gray-400">
                          No 360° image preview
                        </span>
                      </div>
                    )}

                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Upload 360° Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage360Upload(e.target.files[0])}
                      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />

                    {uploadProgress360 > 0 && uploadProgress360 < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#3D5A73] h-2.5 rounded-full"
                            style={{ width: `${uploadProgress360}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading: {Math.round(uploadProgress360)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D5A73] transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !hasChanges}
                    className={`px-6 py-2 border border-transparent rounded-lg ${
                      submitLoading || !hasChanges
                        ? "bg-[#7D8491] cursor-not-allowed"
                        : "bg-[#3D5A73] hover:bg-[#2D4A63]"
                    } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D5A73] transition-colors`}
                    onClick={() => {
                      if (!hasChanges) {
                        toast.warning("No changes have been made to update");
                      }
                    }}
                  >
                    {submitLoading ? (
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
      <ManagerFooter />
    </div>
  );
};

export default UpdateRestaurant;
