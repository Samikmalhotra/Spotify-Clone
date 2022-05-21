import GradientLayout from "../../components/gradientLayout";
import SongTable from "../../components/songTable";
import { validateToken } from "../../lib/auth";
// import SongTable from '../../components/songsTable'
// import { validateToken } from '../../lib/auth'
import prisma from "../../lib/prisma";

export const getBGColor = () => {
  const colors = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "gray",
    "teal",
    "yellow",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

const Playlist = ({ playlist }) => {
  const color = playlist ? getBGColor() : "gray";

  console.log(playlist);

  return (
    <GradientLayout
      color={color || "black"}
      roundImage={false}
      title={playlist ? playlist.name : "Playlist"}
      subtitle="playlist"
      description={`${playlist && playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist && playlist.id}`}
    >
      <SongTable songs={playlist.songs} />
    </GradientLayout>
  );
};

export const getServerSideProps = async ({ query, req }) => {
  let user;

  try {
    user = validateToken(req.cookies.CHORDS_ACCESS_TOKEN);
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }

  const [playlist] = await prisma.playlist.findMany({
    where: {
      id: +query.id,
      userId: user.id,
    },
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { playlist },
  };
};
export default Playlist;
