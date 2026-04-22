"use server";

import { fetchFavouritesAnime } from "../../../actions/ApiData.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchFavouritesAnime();
    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error("Error fetching Favorite anime:", error);
    return NextResponse.json(
      { error: "Failed to fetch Favorite anime" },
      { status: 500 },
    );
  }
}
