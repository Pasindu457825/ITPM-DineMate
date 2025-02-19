import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/pasindu/HomePage';
import AddItemForm from './pages/pasindu/CreateOrder'; //  // Import the AddItemForm component
import DisplayItemForm from './pages/pasindu/OrderList';
import UpdateItemForm from "./pages/pasindu/UpdateOrder";  // Import UpdateItemForm


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-item" element={<AddItemForm />} />
        <Route path="/display-item" element={<DisplayItemForm />} />
        <Route path="/update-item/:id" element={<UpdateItemForm />} />  {/* Add route */}  {/* Add a route for the AddItemForm */}
      </Routes>
    </Router>
  );
};

export default App;
