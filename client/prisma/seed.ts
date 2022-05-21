import { PrismaClient, Song } from "@prisma/client";
import bcrypt from "bcrypt";
import { artistsData } from "./songsData";

const prisma = new PrismaClient();

const uniqueSongs = (songs: Song[]) => {
  const songArr = [];
  for (let i = 0; i < 10; i++) {
    const rand = Math.floor(Math.random() * songs.length);
    const song = songs[rand];
    if (!songArr.includes(song)) {
      songArr.push(song);
    }
  }
  return songArr;
};

const run = async () => {
  const artistArr = [];

  artistsData.map(async (artist) => {
    artistArr.push(
      prisma.artist.upsert({
        where: { name: artist.name },
        update: {},
        create: {
          name: artist.name ? artist.name : "",
          songs: {
            create: artist.songs.map((song) => ({
              name: song.name ? song.name : "",
              duration: song.duration ? song.duration : 0,
              url: song.url ? song.url : "",
              cover: song.cover ? song.cover : "https://picsum.photos/200",
            })),
          },
        },
      })
    );
  });

  await Promise.all(artistArr);

  const salt = bcrypt.genSaltSync();
  const user = await prisma.user.upsert({
    where: { email: "samik@chords.com" },
    update: {},
    create: {
      email: "samik@chords.com",
      password: bcrypt.hashSync("password", salt),
      firstName: "Samik",
      lastName: "Malhotra",
    },
  });

  const playlistArr = [
    "daily vibes",
    "all day every day",
    "3 am",
    "nostalgia",
    "stars",
    "i saw you in a dream",
    "imaginary car chase music",
    "strong enough",
    "summer nights",
    "playlit",
  ];

  const songs = await prisma.song.findMany({});

  const songArr = [];

  new Array(10).fill(1).map(async (_, i) => {
    songArr.push(
      prisma.playlist.create({
        data: {
          name: playlistArr[i],
          user: {
            connect: { id: user.id },
          },
          songs: {
            connect: (uniqueSongs(songs)).map((song) => ({
              id: song.id,
            })),
          },
        },
      })
    );
  });

  await Promise.all(songArr);
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
