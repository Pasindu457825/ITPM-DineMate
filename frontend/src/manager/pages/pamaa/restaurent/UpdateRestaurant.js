import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    tables: [{ seats: "", quantity: "" }],
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${id}`
        );
        setRestaurant({ ...response.data, tables: response.data.tables || [{ seats: "", quantity: "" }] });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details.");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleChange = (e, index) => {
    if (["seats", "quantity"].includes(e.target.name)) {
      const newTables = [...restaurant.tables];
      newTables[index][e.target.name] = e.target.value;
      setRestaurant({ ...restaurant, tables: newTables });
    } else {
      setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (imageFile) {
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
          setError("Image upload failed!");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          updateRestaurantData(downloadURL);
        }
      );
    } else {
      updateRestaurantData(restaurant.image);
    }
  };

  const updateRestaurantData = async (imageUrl) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/ITPM/restaurants/update-restaurant/${id}`,
        { ...restaurant, image: imageUrl }
      );
      alert("Restaurant updated successfully!");
      navigate("/display-restaurant");
    } catch (err) {
      console.error("Error updating restaurant:", err);
      setError("Failed to update restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeTable = (index) => {
    const updatedTables = restaurant.tables.filter((_, idx) => idx !== index);
    setRestaurant({ ...restaurant, tables: updatedTables });
  };

  const addTable = () => {
    const newTables = [...restaurant.tables, { seats: "", quantity: "" }];
    setRestaurant({ ...restaurant, tables: newTables });
  };

  if (loading) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Restaurant</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "location", "phoneNumber"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={restaurant[field]}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        ))}
        {restaurant.tables.map((table, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Seats per Table</label>
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
              <label className="block text-sm font-medium text-gray-700">Number of Tables</label>
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Current Image:</label>
          <img src={restaurant.image} alt="Restaurant" className="w-full h-64 object-cover rounded-lg"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
          {uploadProgress > 0 && (
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Update Restaurant
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

export default UpdateRestaurant;
