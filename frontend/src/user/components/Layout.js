import React from "react";
import { Outlet } from "react-router-dom";
import { UserNavbar } from "./navbar"; // ✅ Import your ComplexNavbar
import Footer from "./Footer"; // ✅ Footer component

const Layout = () => {
  return (
    <div className=" bg-gray-200 flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-1 p-4 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
