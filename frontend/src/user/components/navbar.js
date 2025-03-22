import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";

// =========================
// Profile Menu Component
// =========================
function ProfileMenu({ items }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      {/* Avatar button that opens the dropdown */}
      <MenuHandler>
        <Button
          variant="text"
          className="flex items-center gap-2 p-1 bg-blue-gray-900 rounded-full 
                     transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="User"
            className="border border-gray-300 p-0.5 bg-transparent"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
          />
        </Button>
      </MenuHandler>

      {/* Menu List */}
      <MenuList className="p-2 shadow-lg bg-white border border-gray-300 rounded-md">
        {items.map(({ label, onClick }, idx) => (
          <MenuItem
            key={idx}
            onClick={onClick}
            className="flex items-center gap-2 mb-1 rounded-md px-3 py-2
                       transition duration-300 ease-in-out transform
                       hover:bg-amber-700 hover:text-white hover:scale-105 hover:shadow-lg"
          >
            <Typography variant="small" className="font-normal">
              {label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

// =========================
// Main Navbar Component
// =========================
export function UserNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const navigate = useNavigate();

  // =========================
  // Logout handler
  // =========================
  const handleLogout = () => {
    // Remove items from localStorage (token, role, userId)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    alert("You have been logged out.");
    // Navigate to the login page (adjust as needed)
    navigate("/login");
  };

  // =========================
  // Profile menu items
  // =========================
  const profileMenuItems = [
    { label: "My Profile" },
    { label: "Logout", onClick: handleLogout }, // <--- added Logout item
  ];

  // =========================
  // Desktop nav items
  // =========================
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Restaurants", href: "user/display-restaurent" },
    { label: "Reservation", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Our Services", href: "#" },
  ];

  return (
    <Navbar className="w-full max-w-full bg-blue-gray-900 bg-opacity-100 border-none fixed top-0 left-0 z-50 shadow-md px-4 py-4">
      <div className="flex items-center justify-between w-full">
        {/* Logo + Brand Name */}
        <div className="flex items-center">
          {/* <img src={Logo} alt="DineMate Logo" className="h-10 w-10 mr-2" /> */}
          <Typography
            as="a"
            href="#"
            className="pl-1 font-extrabold text-4xl text-white"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            DineMate
          </Typography>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-white font-medium transition-colors hover:text-amber-700"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right-side Buttons + Profile Menu (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Login Button */}
         <Button
   onClick={() => navigate("/login")}
  variant="filled"
  className="bg-amber-700 text-black hover:text-white
             px-4 py-2 rounded-lg transition duration-300
             ease-in-out transform hover:scale-105 hover:shadow-lg 
             hover:bg-amber-800"
>
  Login
</Button>


          {/* Logout Button */}
          {/* <Button
            variant="filled"
            onClick={handleLogout}
            className="bg-amber-700 text-black hover:text-white
                       px-4 py-2 rounded-lg transition duration-300
                       ease-in-out transform hover:scale-105 hover:shadow-lg 
                       hover:bg-amber-800"
          >
            Logout
          </Button> */}

          {/* Profile Menu (Avatar Dropdown) */}
          <ProfileMenu items={profileMenuItems} />
        </div>

        {/* "Menu" Toggle (Mobile) */}
        <button
          className="lg:hidden text-white rounded-md p-2
                     transition duration-300 ease-in-out transform
                     hover:scale-105 hover:shadow-lg hover:bg-amber-700"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav open={isNavOpen} className="lg:hidden">
        <div className="flex flex-col gap-4 mt-4">
          {navItems.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-white font-medium transition-colors hover:text-amber-700"
            >
              {label}
            </a>
          ))}

          {/* Login & Logout (Mobile) */}
          <div className="flex gap-4 mt-2">
            <Button
              variant="filled"
              className="bg-amber-700 text-black hover:text-white w-full
                         px-4 py-2 rounded-lg transition duration-300
                         ease-in-out transform hover:scale-105 hover:shadow-lg 
                         hover:bg-amber-800"
            >
              Login
            </Button>
            <Button
              variant="filled"
              onClick={handleLogout}
              className="bg-amber-700 text-black hover:text-white w-full
                         px-4 py-2 rounded-lg transition duration-300
                         ease-in-out transform hover:scale-105 hover:shadow-lg 
                         hover:bg-amber-800"
            >
              Logout
            </Button>
          </div>

          {/* Profile Menu (Mobile) */}
          <div className="mt-2">
            <ProfileMenu items={profileMenuItems} />
          </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}
