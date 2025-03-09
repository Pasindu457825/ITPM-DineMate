import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/pasindu/HomePage';
import AddOrderForm from './pages/pasindu/order/CreateOrder'; //  // Import the AddItemForm component
import OrdersList  from './pages/pasindu/order/OrderList';
import UpdateOrderForm from './pages/pasindu/order/UpdateOrder';

import AddReservationForm from './pages/pasindu/reservation/CreateReservation'; //  // Import the AddItemForm component
import ReservationList  from './pages/pasindu/reservation/ReservationList';
import UpdateReservationForm from './pages/pasindu/reservation/UpdateReservation';  // Import UpdateItemForm

import LoginPage from './pages/tharusha/UserSignupPage';
import UserSignupPage from './pages/tharusha/UserSignupPage';
import ManagerSignupPage from './pages/tharusha/ManagerSignupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-order" element={<AddOrderForm />} />
        <Route path="/display-orders" element={<OrdersList  />} />
        <Route path="/update-order/:id" element={<UpdateOrderForm />} />
        
        <Route path="/add-reservation" element={<AddReservationForm />} />
        <Route path="/display-reservations" element={<ReservationList  />} />
        <Route path="/update-reservation/:id" element={<UpdateReservationForm />} />  {/* Add route */}  {/* Add a route for the AddItemForm */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/user" element={<UserSignupPage />} />
        <Route path="/signup/manager" element={<ManagerSignupPage />} />

      </Routes>
    </Router>
  );
};

export default App;
