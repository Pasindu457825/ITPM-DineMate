import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Pasindu Order
import HomePage from './user/pages/pasindu/HomePage';
import AddOrderForm from './user/pages/pasindu/order/CreateOrder'; //  // Import the AddItemForm component
import OrdersList  from './user/pages/pasindu/order/OrderList';
import UpdateOrderForm from './user/pages/pasindu/order/UpdateOrder';
import CartPage  from './user/pages/pasindu//order/CartPage'; 
//Pasindu Reservation
import AddReservationForm from './user/pages/pasindu/reservation/CreateReservation';//  // Import the AddItemForm component
import ReservationsList from './user/pages/pasindu/reservation/ReservationList';
import UpdateReservationForm from './user/pages/pasindu/reservation/UpdateReservation';  // Import UpdateItemForm
//Pasindu Restuarent
import RestaurentList from './user/pages/pasindu/restaurent/RestaurentList';
import RestaurentDetails from './user/pages/pasindu/restaurent/RestaurentDetails';

import LoginPage from './pages/tharusha/UserSignupPage';
import UserSignupPage from './pages/tharusha/UserSignupPage';
import ManagerSignupPage from './pages/tharusha/ManagerSignupPage';


import AddFood from "./pages/pamaa/foodmenu/AddFood";
import UpdateFood from "./pages/pamaa/foodmenu/UpdateFood";
import FoodList from "./pages/pamaa/foodmenu/FoodList";
import CreateRestaurant from "./pages/pamaa/restaurant/CreateRestaurant";
import RestaurantList from "./pages/pamaa/restaurant/RestaurantList";
import UpdateRestaurant from "./pages/pamaa/restaurant/UpdateRestaurant";
import FoodsByRestaurant from "./manager/pages/pamaa/restaurent/FoodsByRestaurant";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Pasindu Order*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/add-order" element={<AddOrderForm />} />
        <Route path="/display-orders" element={<OrdersList />} />
        <Route path="/update-order/:id" element={<UpdateOrderForm />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Pasindu Reservation*/}
        <Route path="/add-reservation" element={<AddReservationForm />} />
        <Route path="/display-reservations" element={<ReservationsList  />} />
        <Route path="/update-reservation/:id" element={<UpdateReservationForm />}/>
        {/* Pasindu Reservation*/}
        <Route path="/user/display-restaurent" element={<RestaurentList  />} />
        <Route path="/user/restaurent-details/:id" element={<RestaurentDetails  />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/user" element={<UserSignupPage />} />
        <Route path="/signup/manager" element={<ManagerSignupPage />} />

        

        {/* Add route */} {/* Add a route for the AddItemForm */}
        <Route path="/add-food/:restaurantId" element={<AddFood />} />
        <Route path="/update-food/:id" element={<UpdateFood />} />
        <Route path="/display-food" element={<FoodList />} />
        <Route path="/add-restaurant" element={<CreateRestaurant />} />
        <Route path="/display-restaurant" element={<RestaurantList />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />
        <Route path="/restaurant/foods/:restaurantId" element={<FoodsByRestaurant  />} />

      </Routes>
    </Router>
  );
};

export default App;
