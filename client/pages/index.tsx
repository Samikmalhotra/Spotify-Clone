import GradientLayout from "../components/gradientLayout";
import prisma from "../lib/prisma";
import { Box, Flex, LinkBox, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { useMe } from "../lib/hooks";
import NextLink from "next/link";

export default function Home({ artists }) {
  const { user, isError } = useMe();
  const newArtists = artists.filter(function (_, i) {
    return !(i % 180);
  });
  return (
    <GradientLayout
      roundImage
      color="blue"
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
          {newArtists.map((artist) => (
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
}

export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({});

  return {
    props: { artists },
  };
};
