import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';

const ManagerHeader = ({ username = "Manager" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg ">
<div className="container mx-auto px-4">

        <div className="flex justify-between items-center py-4">
          {/* Logo and Restaurant Name */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Resto Manager</span>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={toggleProfile} 
              className="flex items-center space-x-2 text-white hover:text-gray-300"
            >
              <User size={20} />
              <span className="sm:inline">{username}</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl py-2 z-10">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</a>
                <div className="border-t border-gray-200 my-1"></div>
                <a href="/logout" className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-500">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;