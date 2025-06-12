"use client";

import React, { useState, useEffect } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { FiSettings, FiUser, FiSearch, FiInfo } from "react-icons/fi"; // Import icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollY && window.scrollY > 50) {
        setHidden(false); // Hide navbar on scroll down
      } else {
        setHidden(false); // Show navbar on scroll up
      }
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <>
      <nav
        className={`NavBarLayout rounded-bl-lg rounded-br-lg bg-blue-900 fixed top-0 left-0 w-full z-50 transition-transform ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="container max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pl-0 pr-4 py-4">
          <a
            href="/"
            className="flex items-center space-x-0 rtl:space-x-reverse ml-0">
            <img
              src="https://raw.githubusercontent.com/bestwall2/AniPlay/refs/heads/main/app/images/logo.png"
              className="h-14"
              alt="AniBox"
            />
          </a>
          <div className="flex items-center md:order-0 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm rounded-full md:me-0 focus:outline-none   "
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] transition-all duration-300 ease-out hover:scale-[0.97] shadow-xl rounded-xl p-2">
                  <FaSearch size={20} />
                </div>

                <img
                  className="w-10 h-10 transition-all duration-300 ease-out hover:scale-[0.97] rounded-full border-gray-600 border-2"
                  src="https://raw.githubusercontent.com/bestwall2/AniPlay/refs/heads/main/app/images/profile.jpg"
                  alt="user photo"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] shadow-xl w-[50px]  transition-all duration-300 ease-out hover:scale-[0.97] flex items-center justify-center h-[50px] fixed rounded-full bottom-0 mb-5 left-10 z-50">
            <BiSolidCategory size={22} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="start"
            sideOffset={5}
            className="z-50 backdrop-blur-xl"
          >
            <DropdownMenuLabel>Main</DropdownMenuLabel>
            <DropdownMenuItem>
              <FiSettings className="mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FiInfo className="mr-2" /> About Us
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FiUser className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FiSearch className="mr-2" /> Search
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </>
  );
};

export default Navbar;
