import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../firebaseConfig"; // Ensure correct path
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const CreateRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    numberOfTables: "",
    seatsPerTable: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image before submitting!");
      return;
    }

    try {
      // ✅ Generate a unique filename to prevent overwriting
      const fileName = `restaurantImages/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
          alert("Image upload failed!");
        },
        async () => {
          // ✅ Get image URL after upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully! URL:", downloadURL);

          // ✅ Save restaurant data with image URL to backend
          try {
            const response = await axios.post(
              "http://localhost:5000/api/ITPM/restaurants/create-restaurant",
              { ...formData, image: downloadURL }
            );
            console.log("Restaurant created successfully:", response.data);
            alert("Restaurant added successfully!");
            navigate("/"); // Redirect after success
          } catch (error) {
            console.error("Error creating restaurant:", error.response || error.message);
            alert("Failed to create restaurant!");
          }
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Create Restaurant
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Details */}
        {["name", "description", "location", "phoneNumber", "numberOfTables", "seatsPerTable"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field.includes("Number") ? "number" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
          {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4">
          Create Restaurant
        </button>
      </form>

      {/* Back to Restaurant List Button */}
      <button onClick={() => navigate("/display-restaurant")} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full">
        Back to Restaurant List
      </button>
    </div>
  );
};

export default CreateRestaurant;
