import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/pasindu/HomePage';
import AddOrderForm from './pages/pasindu/CreateOrder'; //  // Import the AddItemForm component
import OrdersList  from '../src/pages/pasindu/OrderList';
import UpdateOrderForm from "./pages/pasindu/UpdateOrder";  // Import UpdateItemForm


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-order" element={<AddOrderForm />} />
        <Route path="/display-orders" element={<OrdersList  />} />
        <Route path="/update-order/:id" element={<UpdateOrderForm />} />  {/* Add route */}  {/* Add a route for the AddItemForm */}
      </Routes>
    </Router>
  );
};

export default App;
