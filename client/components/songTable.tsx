import { Box, Flex } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Td,
  Tr,
  Tbody,
  Th,
  IconButton,
  Image,
  Button,
} from "@chakra-ui/react";
import { BsFillPlayFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useStoreActions } from "easy-peasy";
import { formatDate, formatTime } from "../lib/formatter";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const SongTable = ({ songs, add = false, playlistId = null }) => {
  const newSongs = [];
  songs.map((song) => {
    const found = newSongs.find((s) => s.name === song.name);
    if (!found) {
      newSongs.push(song);
    }
  });

  songs = newSongs;

  const playSongs = useStoreActions((store: any) => store.changeActiveSongs);
  const setActiveSong = useStoreActions((store: any) => store.changeActiveSong);

  const toast = useToast();

  const handlePlay = (activeSong?) => {
    setActiveSong(activeSong || songs[0]);
    playSongs(songs);
  };


  const addSong = async (song) => {
    const body = {
      playlistId: playlistId,
      songId: song.id,
    };

    try {
      const res = await axios.post(`/api/addToPlaylist`, body);
      console.log(res.data)
      toast({
        title: "Song added",
        description: `We've added ${song.name} to your playlist`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="transparent" color="white">
      <Box padding="10px" marginBottom="20px">
        <Box marginBottom="30px">
          <IconButton
            icon={<BsFillPlayFill fontSize="30px" />}
            aria-label="play"
            colorScheme="green"
            size="lg"
            isRound
            onClick={() => handlePlay()}
          />
        </Box>
        <Table variant="unstyled">
          <Thead borderBottom="1px solid" borderColor="rgba(255,255,255,0.2)">
            <Tr>
              <Th>#</Th>
              <Th>Title</Th>
              <Th>Date Added</Th>
              <Th>
                <AiOutlineClockCircle />
              </Th>
              {add ? <Th>Add</Th> : null}
            </Tr>
          </Thead>
          <Tbody>
            {songs &&
              songs.map((song, i) => (
                <Tr
                  sx={{
                    transition: "all .3s ",
                    "&:hover": {
                      bg: "rgba(255,255,255, 0.1)",
                    },
                  }}
                  key={song.id}
                  cursor="pointer"
                  onClick={() => handlePlay(song)}
                >
                  <Td>
                    <Flex alignItems="end">{i + 1}</Flex>
                  </Td>
                  <Td>
                    <Flex align="end" padding={0} margin={0}>
                      <Image
                        src={song.cover}
                        boxSize="35px"
                        boxShadow="2xl"
                        marginRight="20px"
                        top="10px"
                        position="relative"
                      />
                      {song.name}
                    </Flex>
                  </Td>
                  <Td>{formatDate(song.createdAt)}</Td>
                  <Td>{formatTime(song.duration)}</Td>
                  {add ? (
                    <Td>
                      <Button
                        variant={"outline"}
                        _hover={{ color: "black", background: "white" }}
                        onClick={(e) => {
                          e.preventDefault();
                          addSong(song);
                        }}
                      >
                        Add to Playlist
                      </Button>
                    </Td>
                  ) : null}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default SongTable;
