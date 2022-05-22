import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import NextLink from "next/link";
import GradientLayout from "../components/gradientLayout";
import prisma from "../lib/prisma";
import { useMe } from "../lib/hooks";
import { getBGColor } from "./playlist/[id]";

const Home = ({ artists }) => {
  const { user } = useMe();
  // const moreNewArtists = artists.filter((artist, index) => index < 5);
  const moreNewArtists = artists.filter((artist) => {
    return artist && artist.songs && artist.songs.length > 17;
  });

  return (
    <GradientLayout
      roundImage
      color={getBGColor()}
      subtitle="profile"
      // @ts-ignore
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playlistsCount} public playlists`}
      image={`https://picsum.photos/seed/picsum${Math.floor(
        Math.random() * 400
      )}/400`}
    >
      <Box color="white" paddingX="40px">
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artist this month
          </Text>
          <Text fontSize="md">only visible to you</Text>
        </Box>
        <Flex>
          {moreNewArtists.map((artist) => (
            <NextLink
              href={{
                pathname: `/artist/[id]`,
                query: { id: artist.id },
              }}
              passHref
            >
              <Box paddingX="10px" width="20%">
                <Box
                  bg="gray.900"
                  borderRadius="4px"
                  padding="15px"
                  width="100%"
                  _hover={{ transform: "scale(1.05)" }}
                >
                  <Image
                    src={`https://picsum.photos/seed/picsum${Math.floor(
                      Math.random() * 20
                    )}/400`}
                    borderRadius="100%"
                  />
                  <Box marginTop="20px">
                    <Text fontSize="large">{artist.name}</Text>
                    <Text fontSize="x-small">Artist</Text>
                  </Box>
                </Box>
              </Box>
            </NextLink>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  );
};
export default Home;

export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({
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
      artists: JSON.parse(JSON.stringify(artists)),
    },
  };
};
