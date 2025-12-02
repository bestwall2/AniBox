import React from "react";

import Slider from "./Slider";
import ListItems from "./ListItems";
import Navbar from "./NavBar";
import Footer from "./Footer";
const FirstPage = () => {
  return (
    <>
      {/* Outer wrapper to control scrolling */}
      <div className=" min-h-screen flex flex-col mb-4">
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
