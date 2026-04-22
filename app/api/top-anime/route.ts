"use server";

import { fetchTopAnime } from "../../../actions/ApiData.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchTopAnime();
    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error("Error fetching Top anime:", error);
    return NextResponse.json(
      { error: "Failed to fetch Top anime" },
      { status: 500 },
    );
  }
}
