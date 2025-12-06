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
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollY && window.scrollY > 50) {
        setHidden(false);
      } else {
        setHidden(false);
      }
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
      setIsSearchVisible(false);
    }
  };

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
            className="flex items-center -translate-x-5 transform space-x-0 rtl:space-x-reverse ml-0"
          >
            <img
              src="https://raw.githubusercontent.com/bestwall2/AniBox/refs/heads/main/app/images/logo.png"
              className="h-14"
              alt="AniBox"
            />
          </a>
          <div className="flex items-center md:order-0 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {isSearchVisible ? (
              <form
                onSubmit={handleSearchSubmit}
                className="relative"
                onBlur={() => setIsSearchVisible(false)}
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white rounded-full py-2 px-4 focus:outline-none"
                  placeholder="Search anime..."
                />
                <button
                  type="button"
                  onClick={() => setIsSearchVisible(false)}
                  className="absolute right-10 top-1/2 -translate-y-1/2"
                >
                  <IoClose size={20} />
                </button>
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <FaSearch size={20} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={handleSearchToggle}
                className="flex text-sm rounded-full md:me-0 focus:outline-none"
              >
                <div className="bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] transition-all duration-300 ease-out hover:scale-[0.97] shadow-xl rounded-xl p-2">
                  <FaSearch size={20} />
                </div>
              </button>
            )}

            <img
              className="w-10 h-10 transition-all duration-300 ease-out hover:scale-[0.97] rounded-full border-gray-600 border-2"
              src="https://raw.githubusercontent.com/bestwall2/AniBox/refs/heads/main/app/images/profile.jpg"
              alt="user photo"
            />
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
