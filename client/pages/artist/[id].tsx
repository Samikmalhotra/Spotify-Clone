import GradientLayout from "../../components/gradientLayout";
import SongTable from "../../components/songTable";
import { validateToken } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { getBGColor } from "../playlist/[id]";

const Artist = ({ artist }) => {
  const color = artist ? getBGColor() : "gray";

  return (
    <GradientLayout
      color={color || "black"}
      roundImage
      title={artist ? artist.name : "Artist"}
      subtitle="artist"
      description={`${artist && artist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${artist && artist.id}`}
    >
      <SongTable songs={artist.songs} />
    </GradientLayout>
  );
};

export const getServerSideProps = async ({ query, req }) => {

  const [artist] = await prisma.artist.findMany({
    where: {
      id: +query.id,
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
    props: {
      artist,
    },
  };
};

export default Artist;