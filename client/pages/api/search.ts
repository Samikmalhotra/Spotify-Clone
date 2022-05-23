import { Song } from "@prisma/client";
import { validateRoute } from "../../lib/auth";
import prismaClient from "../../lib/prisma";

export default validateRoute(async (req, res, user) => {
  const { songData } = req.body;

  const allSongs: Song[] = await prismaClient.song.findMany({
      include:{
          artist: true,
      }
  });

  const songs = allSongs.filter((song: Song) => {
    return song.name.toLowerCase().startsWith(songData.toLowerCase());
  });

  res.json(songs);
});
