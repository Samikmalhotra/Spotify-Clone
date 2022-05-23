import prisma from "../../lib/prisma";
import { validateRoute } from "../../lib/auth";

export default validateRoute(async (req, res, user) => {
  const { playlistId, songId } = req.body;

  console.log(playlistId, songId);

  try {
    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId },
      include: { songs: true },
    });

    let songs = playlist.songs;
    let songIds = songs.map((song) => song.id);
    songIds.push(songId);
    const newplaylist = await prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        songs: {
          connect: songIds.map((id) => ({ id })),
        },
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    throw new Error(error.message);
  }
});
