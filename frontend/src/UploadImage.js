import React, { useState } from "react";
import { storage } from "../firebaseConfig"; // Import Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const storageRef = ref(storage, `restaurantImages/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          saveRestaurantToMongoDB(url);
        });
      }
    );
  };

  const saveRestaurantToMongoDB = async (imageUrl) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/restaurants/add",
        {
          name: restaurantName,
          image: imageUrl,
        }
      );
      alert("Restaurant added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Upload Restaurant Image</h2>
      
      <input
        type="text"
        placeholder="Enter Restaurant Name"
        className="w-full p-2 border rounded-lg mb-4"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />

      <input type="file" onChange={handleFileChange} className="mb-4" />
      
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        Upload
      </button>

      {progress > 0 && <p className="mt-2">Upload Progress: {progress}%</p>}

      {downloadURL && (
        <div className="mt-4">
          <p className="text-green-600">Image Uploaded Successfully!</p>
          <img src={downloadURL} alt="Uploaded" className="w-full h-48 object-cover rounded-lg mt-2" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
