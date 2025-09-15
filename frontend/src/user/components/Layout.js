import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserNavbar } from "./navbar";
import Footer from "./Footer";

const Layout = () => {
  const { pathname } = useLocation();

  // list all the paths where you DON'T want the navbar/footer
  const hideOn = ["/chat"];

  const shouldHide = hideOn.includes(pathname);

  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* only render navbar if not in hideOn */}
      {!shouldHide && <UserNavbar />}

      <main className="flex-1 p-4 pt-20">
        <Outlet />
      </main>

      {/* only render footer if not in hideOn */}
      {!shouldHide && <Footer />}
    </div>
  );
};

export default Layout;
