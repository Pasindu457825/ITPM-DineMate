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
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  ViewColumnsIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";
import Logo from "../../assets/logo/DineMate.png";

// Profile Menu Items
const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon },
  { label: "Sign Out", icon: UserCircleIcon },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          className="flex items-center gap-1 p-1 bg-blue-gray-900 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="User"
            className="border border-gray-300 p-0.5 bg-transparent"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
          />
          <ChevronDownIcon
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList className="p-1 shadow-lg bg-white border border-gray-300 rounded-md">
        {profileMenuItems.map(({ label, icon }) => (
          <MenuList className=" shadow-lg bg-white border border-gray-300 rounded-md p-2">
            {profileMenuItems.map(({ label, icon }) => (
              <MenuItem
                key={label}
                className={`flex items-center gap-2 mb-1 transition duration-300 ease-in-out transform rounded-md px-3 py-2 
                ${
                  label === "Sign Out"
                    ? "bg-red-500 text-white hover:bg-red-600 hover:text-black hover:scale-105 hover:shadow-lg"
                    : "bg-amber-700 text-white hover:bg-amber-800 hover:text-black hover:scale-105 hover:shadow-lg"
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 text-white`, // Ensure the icon color matches the text
                })}
                <Typography variant="small" className="font-normal text-white">
                  {label}
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        ))}
      </MenuList>
    </Menu>
  );
}

export function UserNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <Navbar className="w-full max-w-full bg-blue-gray-900 bg-opacity-100 rounded-t-none border-none fixed top-0 left-0 z-50 shadow-md px-4 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <img src={Logo} alt="DineMate Logo" className="h-10 w-10 mr-2" />
          <Typography
            as="a"
            href="#"
            className="pl-1 font-extrabold text-4xl text-white"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            DineMate
          </Typography>
        </div>

        <div className="hidden lg:flex space-x-12">
          <a
            href="#"
            className="text-white font-medium flex items-center gap-2 hover:text-amber-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
          <a
            href="#"
            className="text-white font-medium flex items-center gap-2 hover:text-amber-700 transition-colors"
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
            Restaurants
          </a>
          <a
            href="#"
            className="text-white font-medium flex items-center gap-2 hover:text-amber-700 transition-colors"
          >
            <ViewColumnsIcon className="h-5 w-5" />
            Blocks
          </a>
          <a
            href="#"
            className="text-white font-medium flex items-center gap-2 hover:text-amber-700 transition-colors"
          >
            <InformationCircleIcon className="h-5 w-5" />
            About
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-amber-700 text-black hover:text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            Log In
          </Button>

          <ProfileMenu />
          <IconButton
            size="sm"
            variant="text"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden"
          >
            <Bars2Icon className="h-6 w-6 text-white" />
          </IconButton>
        </div>
      </div>
      <MobileNav open={isNavOpen}>
        <div className="flex flex-col space-y-2">
          <Typography as="a" href="#" className="text-white font-medium">
            Pages
          </Typography>
          <Typography as="a" href="#" className="text-white font-medium">
            Account
          </Typography>
          <Typography as="a" href="#" className="text-white font-medium">
            Blocks
          </Typography>
          <Typography as="a" href="#" className="text-white font-medium">
            Docs
          </Typography>
        </div>
      </MobileNav>
    </Navbar>
  );
}
