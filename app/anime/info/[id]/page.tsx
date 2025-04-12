import React from "react";
import Info from "../../../../components/pages/InfoPages/Info";
import Navbar from "../../../../components/NavBar";

interface AnimeInfoParams {
  id: string;
}

export default async function AnimeInfoLayout({
  params,
}: {
  params: Promise<AnimeInfoParams>;
}) {
  // Await the `params` Promise
  const { id } = await params;

  return (
    <div>
      
      <Info id={id} />   
    </div>
  );
}