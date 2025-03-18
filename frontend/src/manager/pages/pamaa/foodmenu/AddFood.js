import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig"; // Ensure correct path
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddFoodForm = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  // State variables for food item details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("Available"); // ✅ Ensure it's a string
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image before submitting!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Generate a unique filename
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
          // ✅ Get image URL after upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully! URL:", downloadURL);

          // ✅ Ensure price is a number
          const itemPrice = parseFloat(price) || 0;

          // Food item data with image URL
          const foodData = {
            name,
            description,
            price: parseFloat(price) || 0,
            category,
            availability, // ✅ Now always a string
            restaurantId,
            image: downloadURL,
          };

          try {
            const response = await axios.post(
              "http://localhost:5000/api/ITPM/foodItems/create-food-item",
              foodData
            );

            alert("Food item added successfully!");
            // navigate(`/restaurant/${restaurantId}/foods`);
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
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Food Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Food Item Details */}
        <input
          type="text"
          placeholder="Food Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="" disabled>
            Select a Category
          </option>
          <option value="salad">Salad</option>
          <option value="rolls">Rolls</option>
          <option value="desserts">Desserts</option>
          <option value="sandwich">Sandwich</option>
          <option value="cake">Cake</option>
          <option value="pure veg">Pure Veg</option>
          <option value="pasta">Pasta</option>
          <option value="noodles">Noodles</option>
        </select>

        {/* Availability Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={availability === "Available"} // ✅ Ensure correct state
            onChange={(e) =>
              setAvailability(e.target.checked ? "Available" : "Unavailable")
            } // ✅ Convert to string
            className="mt-2"
          />
          <label className="ml-2 text-gray-700">Available</label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Food Image
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

        {/* Submit Food Item */}
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded w-full mt-4 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          {loading ? "Uploading..." : "Add Food Item"}
        </button>
      </form>

      {/* View Food Items List Button */}
      <button
        onClick={() => navigate(`/restaurant/foods/${restaurantId}`)}
        className="mt-4 bg-red-500 text-white p-2 rounded w-full"
      >
        View Food Items List
      </button>
    </div>
  );
};

export default AddFoodForm;
