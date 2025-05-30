// HomePage.js
import { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, ArrowRightCircle, ArrowRight } from "lucide-react";
import axios from "axios"; // for making API requests

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images
  const carouselImages = [
    {
      url: "https://res.cloudinary.com/dh4gisxcw/image/upload/v1742647946/res1_zjxqol.jpg",
      title: "Discover the Best Dining Experience",
      description: "Manage your restaurant with our powerful tools",
    },
    {
      url: "https://res.cloudinary.com/dh4gisxcw/image/upload/v1742647946/res2_gieiuw.jpg",
      title: "Streamline Your Operations",
      description: "Handle reservations, orders, and more with ease",
    },
    {
      url: "https://res.cloudinary.com/dh4gisxcw/image/upload/v1742647946/res3_dpotxa.jpg",
      title: "Grow Your Business",
      description: "Analytics and insights to help you thrive",
    },
  ];

  const [restaurents, setRestaurents] = useState([]); // holds fetched restaurants

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/restaurants/get-all-restaurants"
        );
        const restaurants = response.data;

        // ✅ Filter only enabled restaurants
        const enabledRestaurants = restaurants.filter((r) => r.isEnabled);

        // ✅ Take first 6
        const featured = enabledRestaurants.slice(0, 6);

        setRestaurents(featured);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // // Show only the first 6 restaurents on the homepage
  // const featuredrestaurents = allrestaurents.slice(0, 6);

  // Function to handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-xl text-white mb-8">{slide.description}</p>
              {/* <Button
                color="amber"
                size="lg"
                className="mt-4"
                onClick={() => navigate("/restaurants")}
              >
                Explore Restaurants
              </Button> */}
            </div>
          </div>
        ))}

        {/* Carousel Controls */}

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Featured restaurents Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Restaurants
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {restaurents.map((restaurents) => (
            <div
              key={restaurents.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/restaurants/${restaurents.id}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurents.image}
                  alt={restaurents.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {restaurents.name}
                  </h3>
                  <span className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                    {restaurents.rating} ★
                  </span>
                </div>
                <div className="mt-2 flex items-center text-gray-600">
                  <span>{restaurents.cuisine}</span>
                  <span className="mx-2">•</span>
                </div>
                <Button
                  fullWidth
                  className="mt-4 bg-blue-gray-900 text-white hover:text-black hover:bg-amber-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/add-reservation/${restaurents._id}`);
                  }}
                >
                  Make Reservation
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            color="amber"
            size="lg"
            onClick={() => navigate("/user/display-restaurent")}
            className="px-8"
          >
            View All Restaurants
          </Button>
        </div>
      </div>

      {/* Featured Services Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose DineMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Reservations</h3>
              <p className="text-gray-600">
                Book a table at your favorite restaurant in just a few clicks
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Fast and secure payment processing for all your orders
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Special Offers</h3>
              <p className="text-gray-600">
                Exclusive deals and discounts at participating restaurants
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
