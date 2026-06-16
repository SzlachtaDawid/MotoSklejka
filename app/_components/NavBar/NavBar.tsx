"use client";

import { useState } from "react";
import NavBarList from "./NavBarList";

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="drawer">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={(e) => setIsSidebarOpen(e.target.checked)}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">MotoSklejka</div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal items-center space-x-3 p-0">
              {/* Navbar menu content here */}
              <NavBarList />
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 space-y-3 p-4">
          {/* Sidebar content here */}
          <NavBarList onLinkClick={() => setIsSidebarOpen(false)} />
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
