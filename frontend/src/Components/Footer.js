import React from "react";
import { Typography } from "@material-tailwind/react";
import {
  FaTwitter,
  FaFacebookF,
  FaDribbble,
  FaGithub,
  FaGamepad,
} from "react-icons/fa";
import logo from "../assets/logo/DineMate.png";

const LINKS = [
  {
    title: "Company",
    items: ["About Us", "Blog", "Github", "Free Products"],
  },
  {
    title: "Help and Support",
    items: ["Knowledge Center", "Contact Us", "Premium Support", "Pricing"],
  },
  {
    title: "Resources",
    items: [
      "Documentation",
      "Custom Development",
      "Discord",
      "Tailwind Components",
    ],
  },
  {
    title: "Technologies",
    items: ["React", "HTML"],
  },
];

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="w-full bg-blue-gray-900 text-white py-12 mt-10 border-t border-gray-300">
      <div className="px-10">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full">
          {/* Left Section - Brand & Social Media */}
          <div className="w-full md:w-1/3">
            <img
              src={logo} // ✅ Replace with your actual logo path
              alt="Restaurant Logo"
              className="h-8 w-auto"
            />
            <Typography variant="h5" className="font-bold text-white">
              Restaurant Shop Management
            </Typography>
            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              Manage your restaurant orders, reservations, and more seamlessly.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-white hover:text-gray-200 transition duration-300 text-lg"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-200 transition duration-300 text-lg"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-200 transition duration-300 text-lg"
              >
                <FaDribbble />
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-200 transition duration-300 text-lg"
              >
                <FaGithub />
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-200 transition duration-300 text-lg"
              >
                <FaGamepad />
              </a>
            </div>
          </div>

          {/* Right Section - Navigation Links */}
          <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left mt-6 md:mt-0">
            {LINKS.map(({ title, items }) => (
              <div key={title}>
                <Typography
                  variant="small"
                  className="mb-4 font-semibold text-white uppercase"
                >
                  {title}
                </Typography>
                <ul className="space-y-2">
                  {items.map((link) => (
                    <li key={link}>
                      <Typography
                        as="a"
                        href="#"
                        className="text-gray-500 hover:text-gray-200 transition duration-300"
                      >
                        {link}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Footer Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm w-full">
          <Typography>
            Copyright &copy; {currentYear} Restaurant Shop Management. Made with
            ❤️ for a better web.
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
