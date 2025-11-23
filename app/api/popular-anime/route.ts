"use server";

import { fetchPopularAnime } from "../../../actions/ApiData.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchPopularAnime();
    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error("Error fetching popular anime:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular anime" },
      { status: 500 },
    );
  }
}
