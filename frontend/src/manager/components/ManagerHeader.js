import React, { useState } from 'react';
import { User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerHeader = ({ username = "Manager" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleRestaurantDropdown = () => {
    setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Restaurant Name */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Dinemate Manager</span>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Restaurant Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleRestaurantDropdown} 
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center shadow-md font-medium focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 focus:outline-none"
              >
                Restaurant
                <ChevronDown size={16} className="ml-2" />
              </button>
              
              {isRestaurantDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-10 border border-gray-200">
                  <button 
                    onClick={() => {
                      navigate('/display-restaurant');
                      setIsRestaurantDropdownOpen(false);
                    }} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-1"
                  >
                    View Restaurant
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/add-restaurant');
                      setIsRestaurantDropdownOpen(false);
                    }} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-1"
                  >
                    Add Restaurant
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/orders')} 
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center shadow-md font-medium focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 focus:outline-none"
            >
              Orders
            </button>
            <button 
              onClick={() => navigate('/reservations')} 
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center shadow-md font-medium focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 focus:outline-none"
            >
              Reservations
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 text-white hover:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <User size={20} />
              <span className="sm:inline hidden">{username}</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-10 border border-gray-200">
                <a 
                  href="/me" 
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-1"
                >
                  My Profile
                </a>
                <div className="border-t border-gray-200 my-1"></div>
                <a 
                  href="/logout" 
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-500 transition-colors duration-200 rounded-md mx-1"
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in-down">
            {/* Restaurant Dropdown for Mobile */}
            <button 
              onClick={toggleRestaurantDropdown} 
              className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-between shadow-md font-medium"
            >
              Restaurant
              <ChevronDown size={16} />
            </button>
            
            {isRestaurantDropdownOpen && (
              <div className="pl-4 space-y-2">
                <button 
                  onClick={() => {
                    navigate('/view-restaurant');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-all duration-200 flex items-center shadow-md font-medium"
                >
                  View Restaurant
                </button>
                <button 
                  onClick={() => {
                    navigate('/add-restaurant');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-all duration-200 flex items-center shadow-md font-medium"
                >
                  Add Restaurant
                </button>
              </div>
            )}
            
            <button 
              onClick={() => {
                navigate('/orders');
                setIsMobileMenuOpen(false);
              }} 
              className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center shadow-md font-medium"
            >
              Orders
            </button>
            <button 
              onClick={() => {
                navigate('/reservations');
                setIsMobileMenuOpen(false);
              }} 
              className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center shadow-md font-medium"
            >
              Reservations
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default ManagerHeader;