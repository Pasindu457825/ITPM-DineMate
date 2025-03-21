import React from 'react';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#D0CCCC] text-[#262B3E]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#276265] rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#276265]">Dinemate</span>
            </div>
            <p className="text-[#262B3E] mb-4 max-w-xs">
              Helping restaurant managers streamline operations and provide exceptional dining experiences.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" className="w-8 h-8 rounded-full bg-[#276265] hover:bg-[#1e4a4c] flex items-center justify-center transition-colors duration-200 text-white">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" className="w-8 h-8 rounded-full bg-[#276265] hover:bg-[#1e4a4c] flex items-center justify-center transition-colors duration-200 text-white">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com" className="w-8 h-8 rounded-full bg-[#276265] hover:bg-[#1e4a4c] flex items-center justify-center transition-colors duration-200 text-white">
                <Instagram size={16} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#276265]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-[#262B3E] hover:text-[#276265] transition-colors duration-200 inline-flex items-center">
                  <svg className="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-restaurant" className="text-[#262B3E] hover:text-[#276265] transition-colors duration-200 inline-flex items-center">
                  <svg className="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  My Restaurants
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-[#262B3E] hover:text-[#276265] transition-colors duration-200 inline-flex items-center">
                  <svg className="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-[#262B3E] hover:text-[#276265] transition-colors duration-200 inline-flex items-center">
                  <svg className="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-[#262B3E] hover:text-[#276265] transition-colors duration-200 inline-flex items-center">
                  <svg className="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#276265]">Contact Us</h3>
            <div className="space-y-3 text-[#262B3E]">
              <div className="flex items-start space-x-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-[#276265]" />
                <span>support@dinemate.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-[#276265]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#276265]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Restaurant Ave, Suite 400<br />San Francisco, CA 94158</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-[#276265] bg-[#262B3E]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-white mb-3 md:mb-0">
              © {currentYear} Dinemate. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm text-white">
              <Link to="/privacy" className="hover:text-[#D0CCCC] transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#D0CCCC] transition-colors duration-200">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-[#D0CCCC] transition-colors duration-200">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ManagerFooter;