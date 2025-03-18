import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../../firebaseConfig"; // Ensure correct path
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const CreateRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    tables: [{ seats: "", quantity: "" }],
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Handle form input changes for text inputs and table entries
  const handleChange = (e, index) => {
    if (["seats", "quantity"].includes(e.target.name)) {
      const newTables = [...formData.tables];
      newTables[index][e.target.name] = e.target.value;
      setFormData({ ...formData, tables: newTables });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const newTables = [...formData.tables];
    newTables.splice(index, 1);
    setFormData({ ...formData, tables: newTables });
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
      const fileName = `restaurantImages/${Date.now()}_${imageFile.name}`;
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
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully! URL:", downloadURL);

          try {
            const response = await axios.post(
              "http://localhost:5000/api/ITPM/restaurants/create-restaurant",
              { ...formData, image: downloadURL }
            );
            console.log("Restaurant created successfully:", response.data);
            alert("Restaurant added successfully!");
            navigate("/"); // Redirect after success
          } catch (error) {
            console.error(
              "Error creating restaurant:",
              error.response || error.message
            );
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
        {["name", "description", "location", "phoneNumber"].map(
          (field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          )
        )}

        {formData.tables.map((table, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Seats per Table
              </label>
              <input
                type="number"
                name="seats"
                placeholder="Seats per Table"
                value={table.seats}
                onChange={(e) => handleChange(e, index)}
                required
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Number of Tables
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Number of Tables"
                value={table.quantity}
                onChange={(e) => handleChange(e, index)}
                required
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            {index > 0 && (
            <button 
            type="button" 
            onClick={() => removeTable(index)} 
            style={{ width: '20%' }}
            className="bg-red-500 text-white py-2 rounded-full text-xs"
            title="Remove this table type"
        >
            Remove
        </button>
           
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTable}
          className="mt-2 bg-green-500 text-white p-2 rounded flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </button>

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

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Create Restaurant
        </button>
      </form>
      <button
        onClick={() => navigate("/display-restaurant")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
      >
        Back to Restaurant List
      </button>
    </div>
  );
};

export default CreateRestaurant;
