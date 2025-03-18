import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Pasindu Order
import HomePage from './user/pages/pasindu/HomePage';
import AddOrderForm from './user/pages/pasindu/order/CreateOrder'; //  // Import the AddItemForm component
import OrdersList  from './user/pages/pasindu/order/OrderList';
import UpdateOrderForm from './user/pages/pasindu/order/UpdateOrder';
import ViewMyOrdersPage from './user/pages/pasindu/order/OrderList';
import OrderDetailsPage  from './user/pages/pasindu//order/OrderDetailsPage'; 
import CartPage  from './user/pages/pasindu//order/CartPage'; 
//Pasindu Reservation
import AddReservationForm from './user/pages/pasindu/reservation/CreateReservation';//  // Import the AddItemForm component
import ReservationsList from './user/pages/pasindu/reservation/ReservationList';
import UpdateReservationForm from './user/pages/pasindu/reservation/UpdateReservation';  // Import UpdateItemForm
//Pasindu Restuarent
import RestaurentList from './user/pages/pasindu/restaurent/RestaurentList';
import RestaurentDetails from './user/pages/pasindu/restaurent/RestaurentDetails';
//Tharusha Authentication
import LoginPage from './user/pages/tharusha/LoginPage';
import UserSignupPage from './user/pages/tharusha/UserSignupPage';
import ManagerSignupPage from './manager/pages/tharusha/ManagerSignupPage';
import MyProfilePage from "./user/pages/tharusha/MyProfilePage";
//Pamalka FoodItem
import AddFood from "./manager/pages/pamaa/foodmenu/AddFood";
import UpdateFood from "./manager/pages/pamaa/foodmenu/UpdateFood";
//Pamalka Restaurant
import CreateRestaurant from "./manager/pages/pamaa/restaurent/CreateRestaurant";
import RestaurantList from "./admin/pages/pamaa/restaurent/RestaurantList";
import UpdateRestaurant from "./manager/pages/pamaa/restaurent/UpdateRestaurant";
import FoodsByRestaurant from "./manager/pages/pamaa/restaurent/FoodsByRestaurant";
import ManagerDashboard from "./manager/components/ManagerDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Pasindu Order*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/add-order-details" element={<AddOrderForm />} />
        <Route path="/display-orders" element={<OrdersList />} />
        <Route path="/update-order/:id" element={<UpdateOrderForm />} />
        <Route path="/my-orders/:email" element={<ViewMyOrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage  />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Pasindu Reservation*/}
        <Route path="/add-reservation/:restaurantId" element={<AddReservationForm />} />
        <Route path="/display-reservations" element={<ReservationsList  />} />
        <Route path="/update-reservation/:id" element={<UpdateReservationForm />}/>
        {/* Pasindu Restaurent*/}
        <Route path="/user/display-restaurent" element={<RestaurentList  />} />
        <Route path="/user/restaurent-details/:id" element={<RestaurentDetails  />} />
        {/* Tharusha Authentication*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/user" element={<UserSignupPage />} />
        <Route path="/signup/manager" element={<ManagerSignupPage />} />
        <Route path="/me" element={<MyProfilePage />} />
        {/* Pamalka Restaurent*/}
        <Route path="/add-restaurant" element={<CreateRestaurant />} />
        <Route path="/display-restaurant" element={<RestaurantList />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />
         {/* Pamalka FoodItem*/}
        <Route path="/add-food/:restaurantId" element={<AddFood />} />
        <Route path="/update-food/:id" element={<UpdateFood />} />
        <Route path="/restaurant/foods/:restaurantId" element={<FoodsByRestaurant  />} />


        <Route path="/Manager-dashboard" element={<ManagerDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;
