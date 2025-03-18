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
    availability: true,
    image: "", // URL of the current food item image
  });

  const [newImage, setNewImage] = useState(null); // State for holding a new image file if updated
  const [uploadProgress, setUploadProgress] = useState(0); // State to track the progress of image upload
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(""); // State to store any error messages

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
        setFood(response.data); // Set fetched food item data to state
      } catch (err) {
        setError("Error fetching food details.");
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching data
      }
    };

    fetchFood();
  }, [id]);

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value }); // Update corresponding field in food object
  };

  // Function to handle file selection for new image
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]); // Set new image file to state
    }
  };

  // Function to handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
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
          food.image = downloadURL; // Update food item's image URL
          submitUpdate(); // Submit updated food item data
        }
      );
    } else {
      submitUpdate(); // Submit update if no new image is selected
    }
  };

  // Function to submit the food item update
  const submitUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/ITPM/foodItems/update-food-item/${id}`,
        food
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

  if (loading) {
    return <p className="text-center">Loading food details...</p>; // Display loading text while data is being fetched or submitted
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Update Food Item
      </h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={food.name}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={food.description}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={food.price}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={food.category}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        <label className="block text-sm font-medium text-gray-700">
          Current Food Image
        </label>
        {food.image && (
          <img src={food.image} alt="Food" className="mb-3 w-48" />
        )}

        <label className="block text-sm font-medium text-gray-700">
          Upload New Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Food Item"}
        </button>
      </form>

      <button
        onClick={() => navigate(`/restaurant/foods/${food.restaurantId}`)}
        className="mt-4 bg-green-500 text-white p-2 rounded w-full"
      >
        View Food Items List
      </button>
    </div>
  );
};

export default UpdateFoodForm;
