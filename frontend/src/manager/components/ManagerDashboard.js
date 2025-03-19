import React from 'react';
import { Card, Typography, Button } from "@material-tailwind/react";

const ManagerDashboard = () => {
  // Hardcoded stats for demonstration
  const stats = {
    totalRestaurants: 5,
    totalReservations: 25,
    pendingReservations: 3,
    activeReservations: 22
  };

  return (
    <div className="bg-gray-200 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Restaurants Card */}
        <div className="bg-blue-gray-900 rounded-lg shadow-md p-6 text-center">
          <div className="bg-amber-700/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <Typography variant="h4" color="white" className="mb-2">
            {stats.totalRestaurants}
          </Typography>
          <Typography color="white" className="font-normal mb-4 opacity-70">
            Total Restaurants
          </Typography>
          <Button 
            variant="outlined" 
            color="amber" 
            className="w-full text-white border-white hover:bg-amber-700"
          >
            View Restaurants
          </Button>
        </div>

        {/* Reservations Card */}
        <div className="bg-blue-gray-900 rounded-lg shadow-md p-6 text-center">
          <div className="bg-amber-700/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <Typography variant="h4" color="white" className="mb-2">
            {stats.totalReservations}
          </Typography>
          <Typography color="white" className="font-normal mb-4 opacity-70">
            Total Reservations
          </Typography>
          <div className="space-y-2">
            <Button 
              variant="outlined" 
              color="amber" 
              className="w-full text-white border-white hover:bg-amber-700"
            >
              Manage Reservations
            </Button>
            {stats.pendingReservations > 0 && (
              <Typography color="amber" className="text-sm">
                {stats.pendingReservations} Pending Reservations
              </Typography>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-blue-gray-900 rounded-lg shadow-md p-6 text-center">
          <div className="bg-amber-700/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <Typography variant="h4" color="white" className="mb-2">
            Profile
          </Typography>
          <Typography color="white" className="font-normal mb-4 opacity-70">
            Manage Your Account
          </Typography>
          <Button 
            variant="outlined" 
            color="amber" 
            className="w-full text-white border-white hover:bg-amber-700"
          >
            View Profile
          </Button>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-blue-gray-900 rounded-lg shadow-md p-6 text-center">
          <div className="bg-amber-700/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <Typography variant="h4" color="white" className="mb-2">
            Quick Actions
          </Typography>
          <Typography color="white" className="font-normal mb-4 opacity-70">
            Add or Manage
          </Typography>
          <div className="space-y-2">
            <Button 
              variant="outlined" 
              color="amber" 
              className="w-full text-white border-white hover:bg-amber-700"
            >
              Add New Restaurant
            </Button>
            <Button 
              variant="outlined" 
              color="amber" 
              className="w-full text-white border-white hover:bg-amber-700"
            >
              Create Reservation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;