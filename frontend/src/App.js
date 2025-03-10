import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from './pages/pasindu/HomePage';
import AddOrderForm from './pages/pasindu/order/CreateOrder'; //  // Import the AddItemForm component
import OrdersList  from './pages/pasindu/order/OrderList';
import UpdateOrderForm from './pages/pasindu/order/UpdateOrder'; 
import AddReservationForm from './pages/pasindu/reservation/CreateReservation';//  // Import the AddItemForm component
import ReservationsList from './pages/pasindu/reservation/ReservationList';
import UpdateReservationForm from './pages/pasindu/reservation/UpdateReservation';  // Import UpdateItemForm

import LoginPage from './pages/tharusha/LoginPage';
import UserSignupPage from './pages/tharusha/UserSignupPage';
import ManagerSignupPage from './pages/tharusha/ManagerSignupPage';

import AddFood from "./pages/pamaa/foodmenu/AddFood";
import UpdateFood from "./pages/pamaa/foodmenu/UpdateFood";
import FoodList from "./pages/pamaa/foodmenu/FoodList";
import CreateRestaurant from "./pages/pamaa/restaurant/CreateRestaurant";
import RestaurantList from "./pages/pamaa/restaurant/RestaurantList";
import UpdateRestaurant from "./pages/pamaa/restaurant/UpdateRestaurant";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-order" element={<AddOrderForm />} />
        <Route path="/display-orders" element={<OrdersList />} />
        <Route path="/update-order/:id" element={<UpdateOrderForm />} />

        <Route path="/add-reservation" element={<AddReservationForm />} />
        <Route path="/display-reservations" element={<ReservationsList  />} />
        <Route
          path="/update-reservation/:id"
          element={<UpdateReservationForm />}
        />
         

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/user" element={<UserSignupPage />} />
        <Route path="/signup/manager" element={<ManagerSignupPage />} />

        

        {/* Add route */} {/* Add a route for the AddItemForm */}
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/update-food/:id" element={<UpdateFood />} />
        <Route path="/display-food" element={<FoodList />} />
        <Route path="/add-restaurant" element={<CreateRestaurant />} />
        <Route path="/display-restaurant" element={<RestaurantList />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />



      </Routes>
    </Router>
  );
};

export default App;
