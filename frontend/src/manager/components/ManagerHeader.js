import React, { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Pizza,
  CalendarCheck,
  ShoppingBag,
  Bell,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ManagerHeader = ({ username = "Manager" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] =
    useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isRestaurantDropdownOpen) setIsRestaurantDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isRestaurantDropdownOpen) setIsRestaurantDropdownOpen(false);
  };

  const toggleRestaurantDropdown = () => {
    setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeAllMenus = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setIsRestaurantDropdownOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#262B3E] shadow-lg"
          : "bg-gradient-to-r from-[#262B3E] to-[#262B3E]"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link
              to="/managers"
              onClick={closeAllMenus}
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-[#276265] rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-200">
                <Pizza size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Dinemate
              </span>
            </Link>
            <span className="hidden md:inline-block px-2 py-1 bg-[#276265]/20 text-white text-xs font-semibold rounded-full">
              Manager Portal
            </span>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-[#276265] text-white font-medium shadow-md"
                  : "text-white hover:bg-[#276265]/30"
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>

            {/* Restaurant Dropdown */}
            <div className="relative">
              <button
                onClick={toggleRestaurantDropdown}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                  isActive("/my-restaurant") || isActive("/create-restaurant")
                    ? "bg-[#276265] text-white font-medium shadow-md"
                    : "text-white hover:bg-[#276265]/30"
                }`}
                aria-expanded={isRestaurantDropdownOpen}
                aria-haspopup="true"
              >
                <Pizza size={18} />
                <span>Restaurants</span>
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    isRestaurantDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isRestaurantDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[#262B3E] text-white rounded-lg shadow-xl py-1.5 z-10 border border-gray-700 overflow-hidden">
                  <div className="py-1 bg-[#262B3E]/70 px-3 mb-1.5">
                    <p className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Restaurant Management
                    </p>
                  </div>
                  <Link
                    to="/myrestaurant"
                    onClick={() => setIsRestaurantDropdownOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-[#276265]/30 transition-colors duration-200"
                  >
                    <span className="w-8 text-[#276265]">
                      <Home size={16} />
                    </span>
                    My Restaurants
                  </Link>
                  <Link
                    to="/add-restaurant"
                    onClick={() => setIsRestaurantDropdownOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-[#276265]/30 transition-colors duration-200"
                  >
                    <span className="w-8 text-[#276265]">
                      <Pizza size={16} />
                    </span>
                    Add New Restaurant
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/orders"
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                isActive("/orders")
                  ? "bg-[#276265] text-white font-medium shadow-md"
                  : "text-white hover:bg-[#276265]/30"
              }`}
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
            </Link>

            <Link
              to="/reservations"
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                isActive("/reservations")
                  ? "bg-[#276265] text-white font-medium shadow-md"
                  : "text-white hover:bg-[#276265]/30"
              }`}
            >
              <CalendarCheck size={18} />
              <span>Reservations</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 text-white hover:text-gray-200 px-3 py-1.5 rounded-full hover:bg-[#276265]/30 transition-colors duration-200"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-[#276265] rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <span className="sm:inline hidden font-medium">{username}</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#262B3E] text-white rounded-lg shadow-xl py-2 z-10 border border-gray-700">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-medium text-white">{username}</p>
                  <p className="text-sm text-gray-400">manager@dinemate.com</p>
                </div>
                <Link
                  to="/me"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-[#276265]/20 transition-colors duration-200"
                >
                  <User size={16} className="mr-3 text-[#276265]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/me"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-[#276265]/20 transition-colors duration-200"
                >
                  <svg
                    className="mr-3 h-4 w-4 text-[#276265]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Settings</span>
                </Link>
                <div className="border-t border-gray-700 my-1"></div>
                <Link
                  to="/login"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-red-900/30 text-red-400 transition-colors duration-200"
                >
                  <LogOut size={16} className="mr-3" />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;