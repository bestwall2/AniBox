"use server";

import { getEpisodeServers } from "../../../actions/ApiData.js";

export async function GET(request :any) {
  const { searchParams } = new URL(request.url);

  const anime = searchParams.get("anime");
  const ep = searchParams.get("ep");

  if (!anime || !ep) {
    return Response.json({ error: "Missing parameters" }, { status: 400 });
  }

  const servers = await getEpisodeServers(anime, ep);

  return Response.json(servers);
}
