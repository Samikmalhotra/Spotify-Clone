import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import NextLink from "next/link";

import { useStoreState } from "easy-peasy";
import Player from "./player";

const PlayerBar = () => {
  const songs = useStoreState((state: any) => state.activeSongs);
  const activeSong = useStoreState((state: any) => state.activeSong);

  return (
    <Box height="100px" width="100vw" bg="gray.900" padding="10px">
      <Flex align="center">
        {activeSong ? (
          <Box padding="20px" color="white" width="30%">
            <Flex>
              <Image
                src={activeSong.cover}
                boxSize="50px"
                boxShadow="2xl"
                marginRight="20px"
              />
              <Box>
                <Text fontSize="large">{activeSong.name}</Text>
                <NextLink
                  href={{
                    pathname: `/artist/[id]`,
                    query: { id: activeSong.artist.id },
                  }}
                  passHref
                >
                  <Text fontSize="sm" _hover={{textDecoration: "underline"}}>{activeSong.artist.name}</Text>
                </NextLink>
              </Box>
            </Flex>
          </Box>
        ) : null}
        <Box width="40%">
          {activeSong ? <Player songs={songs} activeSong={activeSong} /> : null}
        </Box>
      </Flex>
    </Box>
  );
};

export default PlayerBar;
