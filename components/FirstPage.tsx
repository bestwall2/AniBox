"use client";

import React, { useState } from "react";
import Slider from "./Slider";
import ListItems from "./ListItems";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { TelegramInviteModal } from "./ui/telegram"; // Import the component

const FirstPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Outer wrapper to control scrolling */}
      <div className="min-h-screen flex flex-col mb-4">
        <TelegramInviteModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          telegramLink="https://t.me/ahmeddie"
        />
        
        {/* Navbar (Static at the top) */}
        <Navbar />
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <Slider />
          <div className="Items container mx-auto p-4 pt-0 pb-5 flex flex-col">
            <ListItems 
              geners="Trending Anime 🔥" 
              apiPath="/api/trending-anime" 
              param="font-semibold"/>
            <ListItems 
              geners="Top 100 Anime 🔝" 
              apiPath="/api/top-anime" 
              param="font-semibold"/>
            <ListItems
              geners="Favorites Anime ❤️"
              apiPath="/api/favorites-anime"
              param="font-semibold"
            />
          </div>
        </div>
        {/*<Footer/>*/}
      </div>
    </>
  );
};

export default FirstPage;
