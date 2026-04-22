"use server";

import { fetchTrendingAnime } from "../../../actions/ApiData.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchTrendingAnime();
    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending anime" },
      { status: 500 },
    );
  }
}
