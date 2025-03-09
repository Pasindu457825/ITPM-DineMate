import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form data
  const [reservation, setReservation] = useState({
    shopName: '',
    tableNumber: '',
    customerName: '',
    customerEmail: '',
    NoofPerson: '',
    date: '',
    time: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch reservation details on component mount
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ITPM/reservations/get-reservation/${id}`);
        setReservation(response.data); // Set the reservation data to state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reservation:', err);
        setError('Failed to load reservation details.');
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]); // Re-fetch if the id changes

  // Handle input changes
  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!reservation.shopName || !reservation.customerName || !reservation.customerEmail || !reservation.NoofPerson || !reservation.date || !reservation.time) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      // Update reservation API call
      const response = await axios.put(`http://localhost:5000/api/ITPM/reservations/update-reservation/${id}`, reservation);
      navigate('/');  // Redirect after successful update
    } catch (err) {
      console.error('Error updating reservation:', err);
      setError('Failed to update reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading reservation details...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Reservation</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Reservation Details */}
        <input
          type="text"
          name="shopName"
          placeholder="Shop Name"
          value={reservation.shopName}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="tableNumber"
          placeholder="Table Number"
          value={reservation.tableNumber}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={reservation.customerName}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="email"
          name="customerEmail"
          placeholder="Customer Email"
          value={reservation.customerEmail}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          name="NoofPerson"
          placeholder="Number of People"
          value={reservation.NoofPerson}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="date"
          name="date"
          value={reservation.date}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="time"
          name="time"
          value={reservation.time}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Submit Update */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4" disabled={loading}>
          {loading ? 'Updating...' : 'Update Reservation'}
        </button>
      </form>

      {/* Button to View Reservations List */}
      <button
        onClick={() => navigate('/reservations')}
        className="mt-4 bg-green-500 text-white p-2 rounded w-full"
      >
        View Reservations List
      </button>
    </div>
  );
};

export default EditReservation;
