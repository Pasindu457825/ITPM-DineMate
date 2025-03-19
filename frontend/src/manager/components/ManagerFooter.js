import React from 'react';

const ManagerFooter = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="text-sm">
          © {new Date().getFullYear()} Dinemate - All Rights Reserved.
        </div>
        <div className="mt-2">
          <a href="/privacy" className="hover:underline text-gray-300">Privacy Policy</a> | 
          <a href="/terms" className="hover:underline text-gray-300">Terms of Service</a>
        </div>
        <div className="mt-2">
          Need help? <a href="mailto:support@dinemate.com" className="hover:underline text-gray-300">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default ManagerFooter;
