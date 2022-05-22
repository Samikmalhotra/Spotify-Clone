import { Box, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import GradientLayout from "../components/gradientLayout";
import { useMe } from "../lib/hooks";
import NextLink from "next/link";
import prisma from "../lib/prisma";
import { validateToken } from "../lib/auth";

const Library = ({ playlists }) => {
  const { user } = useMe();

  return (
    <GradientLayout
      roundImage
      color="blue"
      subtitle="library"
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
            Library
          </Text>
          <Text fontSize="md">Your curated playlists</Text>
        </Box>
        {playlists.map((playlist) => (
          <NextLink
            href={{
              pathname: `/playlist/[id]`,
              query: { id: playlist.id },
            }}
            passHref
          >
            <Box
              paddingX="10px"
              width="20%"
              display="inline-block"
              marginBottom="20px"
            >
              <Box
                bg="gray.900"
                borderRadius="4px"
                padding="15px"
                width="100%"
                _hover={{ transform: "scale(1.05)" }}
              >
                <Image
                  src={`https://picsum.photos/seed/picsum${Math.floor(
                    Math.random() * 2000
                  )}/400`}
                  borderRadius="100%"
                />
                <Box marginTop="20px">
                  <Text fontSize="large">{playlist.name}</Text>
                  <Text fontSize="x-small">Playlist</Text>
                </Box>
              </Box>
            </Box>
          </NextLink>
        ))}
      </Box>
    </GradientLayout>
  );
};

export default Library;

export const getServerSideProps = async ({ req }) => {
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

  const playlists = await prisma.playlist.findMany({
    where: {
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
    props: { playlists },
  };
};
