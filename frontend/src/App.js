import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useLoading } from "./Context/LoadingContext"; // Import Loading Context
import LoadingScreen from "./Components/LoadingScreen"; // ✅ Fixed import path
import Layout from "./user/components/Layout"; // ✅ Correct path

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

// Pasindu manager order
import RestaurantOrders from "./manager/pages/pasindu/MyRestaurantOrders";
import OrderRestaurent from "./manager/pages/pasindu/OrderRestaurent";

// Tharusha Authentication
import LoginPage from "./user/pages/tharusha/LoginPage";
import UserSignupPage from "./user/pages/tharusha/UserSignupPage";
import ManagerSignupPage from "./manager/pages/tharusha/ManagerSignupPage";
import MyProfilePage from "./user/pages/tharusha/MyProfilePage";

import AdminDashboard from "./admin/pages/tharusha/AdminDashboard";
import ForgotPasswordPage from "./user/pages/tharusha/ForgotPasswordPage";
import ResetPasswordOtpPage from "./user/pages/tharusha/ResetPasswordOtpPage";

// Pamalka FoodItem
import AddFood from "./manager/pages/pamaa/foodmenu/AddFood";
import UpdateFood from "./manager/pages/pamaa/foodmenu/UpdateFood";

// Pamalka Restaurant
import CreateRestaurant from "./manager/pages/pamaa/restaurent/CreateRestaurant";
import RestaurantList from "./admin/pages/pamaa/restaurent/RestaurantList";
import UpdateRestaurant from "./manager/pages/pamaa/restaurent/UpdateRestaurant";
import FoodsByRestaurant from "./manager/pages/pamaa/restaurent/FoodsByRestaurant";
import Managers from "./manager/pages/pamaa/ManagersPage";
import MyRestaurant from "./manager/pages/pamaa/restaurent/MyRestaurants";
import FoodLists from "./admin/pages/pamaa/restaurent/FoodLists";

// Payment Management
import UserPayments from "./user/pages/Isuri/payment/userPayment";
import CardPaymentPage from "./user/pages/Isuri/payment/cardpayment";
import CashPaymentPage from "./user/pages/Isuri/payment/cashpay";
import ManagerPaymentsPage from "./manager/pages/Isuri/payment/receivedrequests";
import CompletedPaymentsPage from "./manager/pages/Isuri/payment/viewcompletedpayments";
import MyPayments from "./user/pages/Isuri/payment/mypayments";
import PaymentReport from "./manager/pages/Isuri/payment/PaymentReport";


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

  // ⛔ Prevent routes/layout from rendering while loading screen is active
  if (loading || forceLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {(loading || forceLoading) && <LoadingScreen />}{" "}
      {/* ✅ Show loading screen when navigating */}
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Pasindu Order */}
          <Route index element={<HomePage />} />{" "}
          {/* ✅ Home Page loads when app starts */}
          <Route path="/add-order-details" element={<AddOrderForm />} />
          {/* <Route path="/display-orders" element={<OrdersList />} /> */}
          <Route path="/update-order/:id" element={<UpdateOrderForm />} />
          <Route
            path="/my-orders/:customerEmail"
            element={<ViewMyOrdersPage />}
          />
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password-otp"
            element={<ResetPasswordOtpPage />}
          />
          {/* Payment Management (User) */}
          <Route path="/user/payments" element={<UserPayments />} />
          <Route path="/cardpay" element={<CardPaymentPage />} />
          <Route path="/cashpay" element={<CashPaymentPage />} />
          <Route path="/viewrequests" element={<ManagerPaymentsPage />} />
          <Route path="/payhistory" element={<CompletedPaymentsPage />} />
          <Route path="/myhistory" element={<MyPayments />} />
          <Route path="/payment-report" element={<PaymentReport />} />
  
        </Route>
        {/* pasindu manager order */}
        <Route
          path="/restaurant-orders/:restaurantId"
          element={<RestaurantOrders />}
        />
        <Route path="/OrderRestaurent" element={<OrderRestaurent />} />
        
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
        />{" "}
        <Route path="/admin/foods/:restaurantId" element={<FoodLists />} />
        <Route path="/managers" element={<Managers />} />
        <Route path="/myrestaurant" element={<MyRestaurant />} />
        {/* Tharusha Authentication */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        
        
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
