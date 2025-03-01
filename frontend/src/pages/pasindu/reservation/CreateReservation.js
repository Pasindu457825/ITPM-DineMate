import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateReservation = () => {
    const [formData, setFormData] = useState({
        // reservationId: '',
        shopName: '',
        tableNumber: '',
        customerName: '',
        customerEmail: '',
        NoofPerson: '',
        date: '',
        time: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData); // Log the form data

        try {
            // Make the API call to create the reservation
            const response = await axios.post('http://localhost:5000/api/ITPM/reservations/create-reservation', formData);
            console.log('Reservation created successfully:', response.data); // Log success response
            navigate('/');  // Redirect after successful reservation creation
        } catch (error) {
            console.error('Error creating reservation:', error.response || error.message);  // Log any errors
        }
    };

    const handleGoBack = () => {
        navigate('/display-reservations');  // Navigate back to Reservation List
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Reservation</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reservation Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                    <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Table Number</label>
                    <input
                        type="text"
                        name="tableNumber"
                        value={formData.tableNumber}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Email</label>
                    <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of People</label>
                    <input
                        type="number"
                        name="NoofPerson"
                        value={formData.NoofPerson}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Reservation Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Reservation Time</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded w-full mt-4"
                >
                    Create Reservation
                </button>
            </form>

            {/* Back to Reservation List Button */}
            <button
                onClick={handleGoBack}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
                Back to Reservation List
            </button>
        </div>
    );
};

export default CreateReservation;
