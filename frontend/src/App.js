import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/pasindu/HomePage';
import LoginForm from './pages/pasindu/LoginForm';
import AddItemForm from './pages/pasindu/AddItemForm';  // Import the AddItemForm component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/add-item" element={<AddItemForm />} />  {/* Add a route for the AddItemForm */}
      </Routes>
    </Router>
  );
};

export default App;
