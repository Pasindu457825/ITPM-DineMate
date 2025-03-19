import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useLoading } from "./Context/LoadingContext"; // Import Loading Context
import LoadingScreen from "./Components/LoadingScreen"; // ✅ Fixed import path

// Pasindu Order
import HomePage from "./user/pages/pasindu/HomePage";
import AddOrderForm from "./user/pages/pasindu/order/CreateOrder";
// import OrdersList from "./user/pages/pasindu/order/OrderList";
import UpdateOrderForm from "./user/pages/pasindu/order/UpdateOrder";
import ViewMyOrdersPage from "./user/pages/pasindu/order/OrderList"; // ✅ Ensure correct file
import OrderDetailsPage from "./user/pages/pasindu/order/OrderDetailsPage"; // ✅ Fixed path
import CartPage from "./user/pages/pasindu/order/CartPage"; // ✅ Fixed path

// Pasindu Reservation
import AddReservationForm from "./user/pages/pasindu/reservation/CreateReservation";
import ReservationsList from "./user/pages/pasindu/reservation/ReservationList";
import UpdateReservationForm from "./user/pages/pasindu/reservation/UpdateReservation";

// Pasindu Restaurant
import RestaurentList from "./user/pages/pasindu/restaurent/RestaurentList";
import RestaurentDetails from "./user/pages/pasindu/restaurent/RestaurentDetails";

// Tharusha Authentication
import LoginPage from "./user/pages/tharusha/LoginPage";
import UserSignupPage from "./user/pages/tharusha/UserSignupPage";
import ManagerSignupPage from "./manager/pages/tharusha/ManagerSignupPage";
import MyProfilePage from "./user/pages/tharusha/MyProfilePage";

// Pamalka FoodItem
import AddFood from "./manager/pages/pamaa/foodmenu/AddFood";
import UpdateFood from "./manager/pages/pamaa/foodmenu/UpdateFood";

// Pamalka Restaurant
import CreateRestaurant from "./manager/pages/pamaa/restaurent/CreateRestaurant";
import RestaurantList from "./admin/pages/pamaa/restaurent/RestaurantList";
import UpdateRestaurant from "./manager/pages/pamaa/restaurent/UpdateRestaurant";
import FoodsByRestaurant from "./manager/pages/pamaa/restaurent/FoodsByRestaurant";
import ManagerDashboard from "./manager/components/ManagerDashboard";

const AppContent = () => {
  const location = useLocation();
  const { loading, setLoading } = useLoading(); // ✅ Use loading context
  const [forceLoading, setForceLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setForceLoading(true);

    // Ensure loading stays for at least 1 second
    const minLoadTime = setTimeout(() => setForceLoading(false), 1000);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1200); // Delay actual loading finish

    return () => {
      clearTimeout(timeout);
      clearTimeout(minLoadTime);
    };
  }, [location.pathname]);

  return (
    <>
      {(loading || forceLoading) && <LoadingScreen />}{" "}
      {/* ✅ Show loading screen when navigating */}
      <Routes>
        {/* Pasindu Order */}
        <Route path="/" element={<HomePage />} />
        <Route path="/add-order-details" element={<AddOrderForm />} />
        {/* <Route path="/display-orders" element={<OrdersList />} /> */}
        <Route path="/update-order/:id" element={<UpdateOrderForm />} />
        <Route path="/my-orders/:email" element={<ViewMyOrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Pasindu Reservation */}
        <Route
          path="/add-reservation/:restaurantId"
          element={<AddReservationForm />}
        />
        <Route path="/display-reservations" element={<ReservationsList />} />
        <Route
          path="/update-reservation/:id"
          element={<UpdateReservationForm />}
        />

        {/* Pasindu Restaurant */}
        <Route path="/user/display-restaurent" element={<RestaurentList />} />
        <Route
          path="/user/restaurent-details/:id"
          element={<RestaurentDetails />}
        />

        {/* Tharusha Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/user" element={<UserSignupPage />} />
        <Route path="/signup/manager" element={<ManagerSignupPage />} />
        <Route path="/me" element={<MyProfilePage />} />

        {/* Pamalka Restaurant */}
        <Route path="/add-restaurant" element={<CreateRestaurant />} />
        <Route path="/display-restaurant" element={<RestaurantList />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />

        {/* Pamalka FoodItem */}
        <Route path="/add-food/:restaurantId" element={<AddFood />} />
        <Route path="/update-food/:id" element={<UpdateFood />} />
        <Route
          path="/restaurant/foods/:restaurantId"
          element={<FoodsByRestaurant />}
        />

        {/* Manager Dashboard */}
        <Route path="/Manager-dashboard" element={<ManagerDashboard />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
