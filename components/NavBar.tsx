"use client";

import React, { useState, useEffect } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { FiSettings, FiUser, FiInfo } from "react-icons/fi";
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

interface NavbarProps {
  showSearch?: boolean;
  hideOnScroll?: boolean; // NEW OPTION
}

const Navbar: React.FC<NavbarProps> = ({
  showSearch = true,
  hideOnScroll = true, // default = true
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!hideOnScroll) return; // <-- NEW: disable scroll behavior completely

    const handleScroll = () => {
      if (window.scrollY > scrollY && window.scrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY, hideOnScroll]);

  return (
    <>
      <nav
        className={`NavBarLayout rounded-bl-lg rounded-br-lg bg-blue-900 fixed top-0 left-0 w-full z-50 transition-transform ${
          hideOnScroll
            ? hidden
              ? "-translate-y-full"
              : "translate-y-0"
            : "translate-y-0"
        }`}
      >
        <div className="container max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pl-0 pr-4 py-4">
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center -translate-x-5 transform space-x-0 rtl:space-x-reverse ml-0 flex-shrink-0"
            >
              <img
                src="https://raw.githubusercontent.com/bestwall2/AniBox/refs/heads/main/app/images/logo.png"
                className="h-14"
                alt="AniBox"
              />
            </a>
          </div>

          <div className="flex items-center md:order-0 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {showSearch && (
              <button
                type="button"
                onClick={() => router.push("/search")}
                className="flex text-sm rounded-full md:me-0 focus:outline-none"
              >
                <div className="bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] transition-all duration-300 ease-out hover:scale-[0.97] shadow-xl rounded-xl p-2">
                  <FaSearch size={20} className="text-white" />
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
          <div className="bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] hidden shadow-xl w-[50px] transition-all duration-300 ease-out hover:scale-[0.97] flex items-center justify-center h-[50px] fixed rounded-full bottom-0 mb-5 left-10 z-50">
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
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </>
  );
};

export default Navbar;
