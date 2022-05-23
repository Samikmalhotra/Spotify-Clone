import { Button, Center, Input } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import GradientLayout from "../../components/gradientLayout";
import SongTable from "../../components/songTable";
import { validateToken } from "../../lib/auth";
// import SongTable from '../../components/songsTable'
// import { validateToken } from '../../lib/auth'
import prisma from "../../lib/prisma";
import Search from "../search";
import { Box } from "@chakra-ui/layout";
import axios from "axios"

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
  const [addStage, setAddStage] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(search);

  const changeHandler = async (search) => {
    setSearch(search);
  };

  const clickHandler = async () => {
    setLoading(true);

    const body = {
      songData: `${search}`,
    };

    try {
      const res = await axios.post(
        `${window.location.origin}/api/search`,
        body
      );
      console.log(res.data);
      setResults(res.data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <GradientLayout
      color={color || "black"}
      roundImage={false}
      title={playlist ? playlist.name : "Playlist"}
      subtitle="playlist"
      description={`${playlist && playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist && playlist.id}`}
    >
      {addStage ? (
        <Fragment>
          <Box>
            <Input
              padding="30px"
              margin="30px"
              width="70%"
              marginLeft="50px"
              bgColor="black"
              border="none"
              color="white"
              onChange={(e) => {
                e.preventDefault;
                changeHandler(e.target.value);
              }}
            />
            <Button isLoading={loading} onClick={clickHandler}>
              Search
            </Button>
            {error ? <h4>No Songs found</h4> : <SongTable songs={results} add={true} playlistId={playlist.id} />}
          </Box>
        </Fragment>
      ) : (
        <SongTable songs={playlist.songs} />
      )}
      {addStage ? (
        <Center>
          <Button
            margin="30px"
            onClick={(e) => {
              e.preventDefault;
              setAddStage(false);
            }}
          >
            Go back
          </Button>
        </Center>
      ) : (
        <Center>
          <Button
            onClick={(e) => {
              e.preventDefault;
              setAddStage(true);
            }}
          >
            Add to playlist
          </Button>
        </Center>
      )}

      <br />
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
    props: {
      playlist: JSON.parse(JSON.stringify(playlist)),
    },
  };
};
export default Playlist;
