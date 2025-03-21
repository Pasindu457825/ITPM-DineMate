import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Filter, Menu, MapPin, Phone } from 'lucide-react';

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Apply filters whenever restaurants, searchTerm or statusFilter changes
    let result = [...restaurants];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const isEnabled = statusFilter === 'enabled';
      result = result.filter(restaurant => restaurant.isEnabled === isEnabled);
    }
    
    setFilteredRestaurants(result);
  }, [restaurants, searchTerm, statusFilter]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("You must be logged in to view your restaurants");
        setLoading(false);
        toast.error("Please login to view your restaurants");
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/ITPM/restaurants/get-all-restaurants-id?userId=${userId}`);
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError(error.response?.data?.message || "Failed to load restaurants");
      setLoading(false);
      toast.error("Failed to load restaurants");
    }
  };

  const toggleRestaurantStatus = async (id, isEnabled) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.patch(`http://localhost:5000/api/ITPM/restaurants/toggle-status/${id}?userId=${userId}`, { isEnabled: !isEnabled });
      toast.success("Restaurant status updated successfully");
      fetchRestaurants();
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      toast.error(error.response?.data?.message || "Failed to update restaurant status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-4 sm:mb-0">
            Dinemate All the Restaurants
          </h1>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search restaurants..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status filter */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Restaurants</option>
                <option value="enabled">Enabled Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              {searchTerm || statusFilter !== 'all' 
                ? "No restaurants match your search criteria." 
                : "You haven't added any restaurants yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div 
                key={restaurant._id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  restaurant.isEnabled ? 'border-t-4 border-emerald-400' : 'border-t-4 border-red-400'
                }`}
              >
                <div className="relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-48 object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant+Image';
                    }}
                  />
                  <div className="absolute top-0 right-0 m-2">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        restaurant.isEnabled 
                          ? 'bg-yellow-200 text-black-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {restaurant.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-2 text-indigo-500" />
                    <p>{restaurant.location}</p>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <Phone size={16} className="mr-2 text-indigo-500" />
                    <p>{restaurant.phoneNumber}</p>
                  </div>
                  
                  {restaurant.tables && restaurant.tables.length > 0 && (
                    <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center mb-2 text-indigo-700 font-medium">
                        <Menu size={16} className="mr-2" />
                        <p>Available Tables</p>
                      </div>
                      {restaurant.tables.map((table, index) => (
                        <p key={index} className="text-gray-700 text-sm ml-6">
                          • <span className="font-medium">{table.quantity}</span> tables with <span className="font-medium">{table.seats}</span> seats each
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                      onClick={() => navigate(`/admin/foods/${restaurant._id}`)}
                      className="flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 px-4 transition-colors text-sm font-medium"
                    >
                      <Menu size={16} className="mr-2" />
                      <span>Food Menu</span>
                    </button>
                    
                    <button 
                      onClick={() => toggleRestaurantStatus(restaurant._id, restaurant.isEnabled)}
                      className={`flex justify-center items-center ${
                        restaurant.isEnabled 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-emerald-500 hover:bg-emerald-600'
                      } text-white rounded-lg py-2 px-4 transition-colors text-sm font-medium`}
                    >
                      <span>{restaurant.isEnabled ? 'Disable' : 'Enable'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsList;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Search, Filter, Menu, MapPin, Phone } from 'lucide-react';

// const RestaurantsList = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   useEffect(() => {
//     // Apply filters whenever restaurants, searchTerm or statusFilter changes
//     let result = [...restaurants];
    
//     // Apply search filter
//     if (searchTerm) {
//       result = result.filter(restaurant => 
//         restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'all') {
//       const isEnabled = statusFilter === 'enabled';
//       result = result.filter(restaurant => restaurant.isEnabled === isEnabled);
//     }
    
//     setFilteredRestaurants(result);
//   }, [restaurants, searchTerm, statusFilter]);

//   const fetchRestaurants = async () => {
//     try {
//       setLoading(true);
//       const userId = localStorage.getItem("userId");
      
//       if (!userId) {
//         setError("You must be logged in to view your restaurants");
//         setLoading(false);
//         toast.error("Please login to view your restaurants");
//         return;
//       }
      
//       const response = await axios.get(`http://localhost:5000/api/ITPM/restaurants/get-all-restaurants?userId=${userId}`);
//       setRestaurants(response.data);
//       setFilteredRestaurants(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching restaurants:", error);
//       setError(error.response?.data?.message || "Failed to load restaurants");
//       setLoading(false);
//       toast.error("Failed to load restaurants");
//     }
//   };

//   const toggleRestaurantStatus = async (id, isEnabled) => {
//     try {
//       const userId = localStorage.getItem("userId");
//       await axios.patch(`http://localhost:5000/api/ITPM/restaurants/toggle-status/${id}?userId=${userId}`, { isEnabled: !isEnabled });
//       toast.success("Restaurant status updated successfully");
//       fetchRestaurants();
//     } catch (error) {
//       console.error("Error updating restaurant status:", error);
//       toast.error(error.response?.data?.message || "Failed to update restaurant status");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-indigo-800 mb-4 sm:mb-0">
//             My Restaurants
//           </h1>
          
//           <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
//             {/* Search input */}
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search restaurants..."
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             {/* Status filter */}
//             <div className="relative flex-shrink-0">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Filter size={18} className="text-gray-400" />
//               </div>
//               <select
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Restaurants</option>
//                 <option value="enabled">Enabled Only</option>
//                 <option value="disabled">Disabled Only</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center p-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
//             <p>{error}</p>
//           </div>
//         ) : filteredRestaurants.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <p className="text-gray-600 text-lg">
//               {searchTerm || statusFilter !== 'all' 
//                 ? "No restaurants match your search criteria." 
//                 : "You haven't added any restaurants yet."}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {filteredRestaurants.map((restaurant) => (
//               <div 
//                 key={restaurant._id} 
//                 className={`bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 ${
//                   restaurant.isEnabled ? 'border-t-4 border-emerald-400' : 'border-t-4 border-red-400'
//                 }`}
//               >
//                 <div className="relative">
//                   <img 
//                     src={restaurant.image} 
//                     alt={restaurant.name} 
//                     className="w-full h-32 object-cover" 
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant+Image';
//                     }}
//                   />
//                   <div className="absolute top-0 right-0 m-2">
//                     <span 
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         restaurant.isEnabled 
//                           ? 'bg-yellow-200 text-black-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}
//                     >
//                       {restaurant.isEnabled ? 'Active' : 'Disabled'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-3">
//                   <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">{restaurant.name}</h2>
                  
//                   <div className="flex items-center text-gray-600 text-xs mb-1">
//                     <MapPin size={12} className="mr-1 text-indigo-500 flex-shrink-0" />
//                     <p className="truncate">{restaurant.location}</p>
//                   </div>
                  
//                   <div className="flex items-center text-gray-600 text-xs mb-2">
//                     <Phone size={12} className="mr-1 text-indigo-500 flex-shrink-0" />
//                     <p>{restaurant.phoneNumber}</p>
//                   </div>
                  
//                   {restaurant.tables && restaurant.tables.length > 0 && (
//                     <div className="bg-indigo-50 p-2 rounded-lg mb-2">
//                       <div className="flex items-center mb-1 text-indigo-700 font-medium text-xs">
//                         <Menu size={12} className="mr-1" />
//                         <p>Tables</p>
//                       </div>
//                       <div className="max-h-12 overflow-y-auto">
//                         {restaurant.tables.map((table, index) => (
//                           <p key={index} className="text-gray-700 text-xs ml-3 truncate">
//                             • <span className="font-medium">{table.quantity}x</span> {table.seats} seats
//                           </p>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-2 gap-2 mt-2">
//                     <button 
//                       onClick={() => navigate(`/admin/foods/${restaurant._id}`)}
//                       className="flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1 px-2 transition-colors text-xs font-medium"
//                     >
//                       <Menu size={12} className="mr-1" />
//                       <span>Menu</span>
//                     </button>
                    
//                     <button 
//                       onClick={() => toggleRestaurantStatus(restaurant._id, restaurant.isEnabled)}
//                       className={`flex justify-center items-center ${
//                         restaurant.isEnabled 
//                           ? 'bg-red-500 hover:bg-red-600' 
//                           : 'bg-emerald-500 hover:bg-emerald-600'
//                       } text-white rounded-lg py-1 px-2 transition-colors text-xs font-medium`}
//                     >
//                       <span>{restaurant.isEnabled ? 'Disable' : 'Enable'}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantsList;