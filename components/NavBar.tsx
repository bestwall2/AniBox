"use client";

import React, { useState, useEffect } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { FiSettings, FiUser, FiSearch, FiInfo, FiHome, FiFilm, FiTv, FiBookmark } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaSearch } from "react-icons/fa";
import SearchInput from "./ui/SearchInput";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <>
      <nav
        className={`NavBarLayout fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10" 
            : "bg-gradient-to-b from-black via-black/80 to-transparent"
        }`}
      >
        <div className="container max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse group">
            <img
              src="https://raw.githubusercontent.com/bestwall2/AniBox/refs/heads/main/app/images/logo.png"
              className="h-12 md:h-14 transition-transform duration-300 group-hover:scale-105"
              alt="AniBox"
            />
          </a>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavItem href="/" icon={<FiHome size={18} />} label="Home" active />
            <NavItem href="/browse" icon={<FiFilm size={18} />} label="Browse" />
            <NavItem href="/movies" icon={<FiTv size={18} />} label="Movies" />
            <NavItem href="/watchlist" icon={<FiBookmark size={18} />} label="Watchlist" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Button/Desktop Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <FaSearch size={18} className="text-white" />
              </button>
              
              {/* Desktop Search Input */}
              <div className={`absolute right-0 top-14 transition-all duration-300 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl min-w-[300px]">
                  <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#3888E7] focus:ring-1 focus:ring-[#3888E7]"
                  />
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 pr-3 transition-all duration-300"
                >
                  <img
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] shadow-lg"
                    src="https://raw.githubusercontent.com/bestwall2/AniBox/refs/heads/main/app/images/profile.jpg"
                    alt="user photo"
                  />
                  <span className="hidden md:block text-sm font-medium text-white">Username</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="z-50 backdrop-blur-xl bg-black/95 border border-white/10 min-w-[200px]"
                >
                  <DropdownMenuLabel className="text-gray-400">Account</DropdownMenuLabel>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                    <FiUser className="mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                    <FiBookmark className="mr-2" /> Watchlist
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                    <FiSettings className="mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                    <FiInfo className="mr-2" /> About Us
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Border Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3888E7]/50 to-transparent opacity-50"></div>
      </nav>

      {/* Mobile Floating Action Button - Only visible on small screens */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] shadow-xl shadow-purple-500/30 w-[55px] h-[55px] flex items-center justify-center fixed rounded-full bottom-6 left-6 z-50 transition-transform duration-300 hover:scale-110 active:scale-95">
              <BiSolidCategory size={24} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              align="start"
              sideOffset={10}
              className="z-50 backdrop-blur-xl bg-black/95 border border-white/10"
            >
              <DropdownMenuLabel className="text-gray-400">Menu</DropdownMenuLabel>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <FiHome className="mr-2" /> Home
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <FiFilm className="mr-2" /> Browse
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <FiTv className="mr-2" /> Movies
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <FiBookmark className="mr-2" /> Watchlist
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <FiSettings className="mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <FiInfo className="mr-2" /> About Us
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </>
  );
};

// NavItem Component for Desktop Navigation
const NavItem = ({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) => {
  return (
    <a
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        active 
          ? "bg-white/10 text-white" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
};

export default Navbar;
